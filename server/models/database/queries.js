import pool from "../pool.js"; 
import rarityMap from "../defaultRatings.js";
import queryGenerator from "../config/queryGenerator.js";
import trophyData from "../config/trophyData.js";

/**
 * Returns all a user's set reviews and associated set information 
 * @param {number} userid 
 * @returns An array of objects containing set_review_name, set_code, set_name, user_set_id, user_set_img
 */
async function getAllSetReviews(userid) {
    const query = `SELECT user_sets.*, sets.name AS set_name, set_code, set_img
                    FROM user_sets 
                    JOIN sets ON user_sets.set_id = sets.set_id 
                    WHERE user_id = $1`;
    try {
        const { rows } = await pool.query(query, [userid]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}


async function getSetReviewCardsEdit(userSetId) {

    let transaction; 
    const extractSetId = `SELECT set_id, includes_bonus FROM user_sets WHERE user_set_id = $1`;

    try {
        transaction = await pool.connect();
        await transaction.query("BEGIN");

        const { rows } = await transaction.query(extractSetId, [userSetId]);
        const {set_id, includes_bonus} = rows[0];
        
        const allCardsQuery = `SELECT
                                cards.*,
                                faces.*,
                                reviews.review_id,
                                reviews.rank,
                                tags.name AS tag_name
                            FROM cards
                            LEFT JOIN reviews
                                ON cards.card_id = reviews.card_id AND reviews.user_set_id = $1
                            LEFT JOIN faces
                                ON cards.card_id = faces.card_id
                            LEFT JOIN review_tags
                                ON reviews.review_id = review_tags.review_id
                            LEFT JOIN tags
                                ON tags.tag_id = review_tags.tag_id
                            WHERE cards.set_id = $2${includes_bonus ? ` OR cards.set_id IN 
                                   (SELECT bonus_set_id FROM bonus_links WHERE main_set_id = $2)`: ``}`;
    
        const { rows: allCards } = await transaction.query(allCardsQuery, [userSetId, set_id]);

        await transaction.query("COMMIT");

        return { allCards }; 
    } catch (err) {
        console.log(err);
        await transaction.query("ROLLBACK");
    } finally {
        transaction.release(); 
    }
}

async function postSetReviewCardsEdit(userSetId, added, removed) {
    let transaction; 
    const extractDefaultApplied = `SELECT default_applied FROM user_sets WHERE user_set_id = $1`; 
    let insertCardsToReviewInitialQuery = `INSERT INTO reviews(user_set_id, card_id, rank) VALUES `;

    const NUM_COLS_INSERT = 3; 
    let insertCardsToReview = queryGenerator(insertCardsToReviewInitialQuery, added.length, NUM_COLS_INSERT);

      try {

        transaction = await pool.connect();
        await transaction.query("BEGIN");

        const {rows: defaultAppliedRows} = await transaction.query(extractDefaultApplied, [userSetId]);
        const {defaultApplied} = defaultAppliedRows[0];

        if (added.length > 0)  {
            const dataArray = []; 
                added.forEach(cardId => {
                    dataArray.push(userSetId, cardId);
                    //defaultApplied ? dataArray.push(rarityMap[card.rarity]) : dataArray.push("NR");
                    dataArray.push("NR");
                });
            
            await transaction.query(insertCardsToReview, dataArray);
        }

        if (removed.length > 0) {
            const placeholders = removed.map((_, i) => `$${i + 2}`).join(", ");
            const query = `DELETE FROM reviews WHERE card_id IN (${placeholders}) AND user_set_id = $1`;
            await transaction.query(query, [userSetId, ...removed]);
        }

        await transaction.query("COMMIT");

      } catch (err) {

        await transaction.query("ROLLBACK");

      } finally {
         transaction.release(); 
      }

}


async function getSetReview(userid, userSetId) {
    const query = `SELECT user_sets.*, sets.name AS set_name, set_code, set_img
                    FROM user_sets 
                    JOIN sets ON user_sets.set_id = sets.set_id 
                    WHERE user_id = $1 AND user_set_id = $2`;
    try {
        const { rows } = await pool.query(query, [userid, userSetId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}


/**
 * Creates a set review with the specified name and parameters.
 * Then, creates ratings for all the cards in the set - if default, a specified Rank, otherwise null. 
 * @param {number} userid 
 * @param {string} setid 
 * @param {string} name 
 * @param {boolean} defaultApplied - Ranking specified by defaultRatings object 
 * @param {boolean} bonusAdded - Bonus draft legal cards also make it into the set, populates bonus_links
 */

//refactor to do one transaction 
async function createSetReview(userid, setid, sr_name, defaultApplied, bonusAdded, makeShard) {

    const extractSetImgQuery = `SELECT set_img FROM sets WHERE set_id = $1`; 
    const insertIntoReviewsQuery = `INSERT INTO user_sets(user_id, set_id, name, default_applied, includes_bonus, user_set_img)
                   VALUES ($1, $2, $3, $4, $5, $6)
                   RETURNING user_set_id, name, user_set_img`;
    const getCardsToInsertQuery = `SELECT * FROM cards WHERE set_id = $1${bonusAdded ? ` OR set_id IN 
                                   (SELECT bonus_set_id FROM bonus_links WHERE main_set_id = $1)`: ``}`;
    let insertCardsToReviewInitialQuery = `INSERT INTO reviews(user_set_id, card_id, rank) VALUES `;
    const initialTrophyQuery = `INSERT INTO trophies(user_set_id, name, description, trophy_img_url) VALUES `;
    let transaction; 

    try {
        transaction = await pool.connect();
        await transaction.query("BEGIN");

        const { rows: setImgRow } = await transaction.query(extractSetImgQuery, [setid]);
        const setImg = setImgRow[0].set_img; 

        const { rows: userSetInfo } = await transaction.query(insertIntoReviewsQuery, [userid, setid, sr_name, defaultApplied, bonusAdded, setImg]);
        const { user_set_id, name, user_set_img } = userSetInfo[0];

        if (!makeShard) {
            const { rows: cards } = await transaction.query(getCardsToInsertQuery, [setid]);

            const NUM_COLS_INSERT = 3; 
            let insertCardsToReview = queryGenerator(insertCardsToReviewInitialQuery, cards.length, NUM_COLS_INSERT);

            const dataArray = []; 
            cards.forEach(card => {
                dataArray.push(user_set_id, card.card_id);
                defaultApplied ? dataArray.push(rarityMap[card.rarity]) : dataArray.push("NR");
            });
            
            await transaction.query(insertCardsToReview, dataArray);
        }

        //Generating trophy data for set review 
        const NUM_COLS_TROPHIES = 4; 
        let trophyQuery = queryGenerator(initialTrophyQuery, trophyData.length, NUM_COLS_TROPHIES);
        trophyQuery += ` ON CONFLICT DO NOTHING`; 

        const trophyDataArray = []; 
        trophyData.forEach(trophy => trophyDataArray.push(user_set_id, ...trophy));

        await transaction.query(trophyQuery, trophyDataArray);

        await transaction.query("COMMIT");
        return { user_set_id, name, user_set_img };
        
    } catch (err) {
        console.log(err);
        await transaction.query("ROLLBACK");
    } finally {
        transaction.release();
    }
}

/**
 * Deletes the user set review associated with its id 
 * @param {number} userSetId 
 */
async function deleteSetReview(userSetId) {
    const query = `DELETE FROM user_sets WHERE user_set_id = $1`;
    try {
        await pool.query(query, [userSetId]);
    } catch (err) {
        console.log(err);
    }
}

/**
 * By default, returns all available non-bonus sets and associated information.
 * @returns 
 */
async function getSets(isBonus=false) {
    const query = `SELECT * FROM sets${isBonus ? `` : ` WHERE is_bonus = false`}`;

    try {
        const { rows } = await pool.query(query);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

/**
 * Gets a user's reviews and associated card information for the cards composing the userSetId's set 
 * @param {int} userSetId - Id for the set review 
 * @returns 
 */
async function getReviewsWithCards(userSetId) {
    const query = `SELECT cards.*, faces.*, reviews.*, tags.name AS tag_name FROM reviews 
                   JOIN cards ON cards.card_id = reviews.card_id 
                   JOIN faces ON cards.card_id = faces.card_id 
                   LEFT JOIN review_tags ON reviews.review_id = review_tags.review_id
                   LEFT JOIN tags ON tags.tag_id = review_tags.tag_id
                   WHERE reviews.user_set_id = $1
                   ORDER BY cards.collector_number;`;
    try {
        const { rows } = await pool.query(query, [userSetId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

/**
 * Returns card from associated user set id 
 * @param {number} userSetId 
 * @param {uuid} cardId 
 * @returns 
 */
async function getCardFromSetReview(userSetId, cardId) {
    const query = `SELECT * FROM reviews 
                   JOIN cards ON cards.card_id = reviews.card_id 
                   JOIN faces ON cards.card_id = faces.card_id
                   WHERE user_set_id = $1 AND reviews.card_id = $2`;

    try {
        const { rows } = await pool.query(query, [userSetId, cardId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

async function getSetReviewTrophies(userSetId) {
    //const query = `SELECT * FROM trophies WHERE user_set_id = $1`

    const query = `SELECT
                    trophies.trophy_id,
                    trophies.user_set_id,
                    trophies.review_id,
                    trophies.name,
                    trophies.description,
                    trophies.trophy_img_url,
                    trophies.is_global,
                    faces.name AS card_name,
                    faces.image_normal
                FROM trophies
                LEFT JOIN reviews ON reviews.review_id = trophies.review_id
                LEFT JOIN faces ON faces.card_id = reviews.card_id AND faces.face_index = 0
                WHERE trophies.user_set_id = $1;`
    try {
        const { rows } = await pool.query(query, [userSetId]);
        return rows; 

    } catch (err) {
        console.log(err);
    }
}

/**
 * Sets the rank and notes of specified card of associated user set
 * @param {number} userSetId 
 * @param {uuid} cardId 
 * @param {string} rank 
 * @param {string} notes 
 */
async function patchCardFromSetReview(userSetId, cardId, rank, notes) {
    const query = `UPDATE reviews SET rank = $1, notes = $2 WHERE user_set_id = $3 AND card_id = $4`;

    try {
        await pool.query(query, [rank, notes, userSetId, cardId]);
    } catch (err) {
        console.log(err);
    }
}

/**
 * Sets the rank and notes of specified card of associated user set
 * @param {number} userSetId 
 * @param {uuid} cardId 
 * @param {string} rank 
 * @param {string} notes 
 */
async function patchCardFromSetReviewByReviewId(reviewId, rank, notes) {
    const query = `UPDATE reviews SET rank = $1, notes = $2 WHERE review_id = $3`;

    try {
        await pool.query(query, [rank, notes, reviewId]);
    } catch (err) {
        console.log(err);
    }
}

async function getTrophiesFromReview(reviewId) {
    const query = `SELECT * FROM trophies WHERE review_id = $1`;

    try {
        const {rows} = await pool.query(query, [reviewId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

async function getSetReviewTags(userSetId) {
        const query = `SELECT * FROM tags WHERE user_set_id = $1`;

    try {
        const {rows} = await pool.query(query, [userSetId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

async function assignTrophiesToReview(reviewId, trophyIds) {
    let initialQuery = `UPDATE trophies SET review_id = $1 WHERE trophy_id IN `;
    let query = queryGenerator(initialQuery, 1, trophyIds.length, 1);

    let dataArray = [reviewId]; 
    dataArray.push(...trophyIds);

    try {
        await pool.query(query, dataArray);
    } catch (err) {
        console.log(err);
    }
}

async function putSetReviewTrophies(userSetId, trophies) {
    let initialQuery = `UPDATE trophies SET review_id = data.review_id FROM ( VALUES `;
    let querySegment = queryGenerator(initialQuery, trophies.length, 2, 1, true);
    let query = querySegment += `) AS data(trophy_id, review_id) WHERE trophies.trophy_id = data.trophy_id AND trophies.user_set_id = $1`;

    let dataArray = [Number(userSetId)]; 
    trophies.forEach(trophy => dataArray.push(Number(trophy.trophy_id), Number(trophy.review_id)));

    try {
        await pool.query(query, dataArray);
    } catch (err) {
        console.log(err);
    } 
}

async function getReviewPageInformation(reviewId, userId) {

    //extracting card details 
    const cardQuery = `SELECT * FROM reviews 
                        JOIN cards on cards.card_id = reviews.card_id 
                        JOIN faces ON cards.card_id = faces.card_id 
                        WHERE reviews.review_id = $1;`

    const cardDataArray = [reviewId];

    //remember to call extract cards from rows  

    //extracting tags 
    const reviewTagQuery = `SELECT * FROM review_tags 
                    JOIN tags ON tags.tag_id = review_tags.tag_id 
                    WHERE user_id = $1 AND review_id = $2`;
    
    const reviewTagDataArray = [userId, reviewId]; 

    const allTagsQuery = `SELECT * FROM tags WHERE user_set_id = (SELECT user_set_id FROM reviews WHERE review_id = $1)`;

    const allTagsDataArray = [reviewId]; 

    const trophyQuery =  `SELECT
                            trophies.trophy_id,
                            trophies.user_set_id,
                            trophies.review_id,
                            trophies.name,
                            trophies.description,
                            trophies.trophy_img_url,
                            trophies.is_global,
                            faces.name AS card_name,
                            faces.image_normal
                        FROM trophies
                        LEFT JOIN reviews ON reviews.review_id = trophies.review_id
                        LEFT JOIN faces ON faces.card_id = reviews.card_id AND faces.face_index = 0
                        WHERE trophies.user_set_id = (SELECT user_set_id FROM reviews WHERE review_id = $1)
                        ORDER BY trophies.trophy_id;`

    const trophyDataArray = [reviewId];

    let transaction; 

    try {
        transaction = await pool.connect();  
        await transaction.query("BEGIN");

        const cardDetails = (await transaction.query(cardQuery, cardDataArray)).rows;
        const reviewTags = (await transaction.query(reviewTagQuery, reviewTagDataArray)).rows;
        const allTags = (await transaction.query(allTagsQuery, allTagsDataArray)).rows;
        const trophies = (await transaction.query(trophyQuery, trophyDataArray)).rows;

        await transaction.query("COMMIT");

        return {cardDetails, reviewTags, allTags, trophies}; 

    } catch (err) {
        await transaction.query("ROLLBACK");
    } finally {
        transaction.release();
    }
}

async function performPageUpdate(pageInformation) {

    const {reviewId, rank, notes, selectedTags, trophies, userSetId} = pageInformation;
    const transaction = await pool.connect();  

    let patchCardQuery = `UPDATE reviews SET rank = $1, notes = $2 WHERE review_id = $3`;
    const patchCardDataArray = [rank, notes, reviewId]; 

    let deleteTagsQuery=``; 
    let insertTagsQuery=``;
    let deleteTagsDataArray=[]; 
    let insertTagsDataArray=[];

    if (selectedTags.length > 0) {
        deleteTagsQuery = `DELETE FROM review_tags WHERE review_id = $1 AND tag_id NOT IN `;
        deleteTagsQuery = queryGenerator(deleteTagsQuery, 1, selectedTags.length, 1);
        deleteTagsDataArray = [reviewId, ...selectedTags]; 

        insertTagsQuery = `INSERT INTO review_tags(review_id, tag_id) VALUES `;
        insertTagsQuery = `${queryGenerator(insertTagsQuery, selectedTags.length, 2)} ON CONFLICT DO NOTHING`;
        insertTagsDataArray = [];
        selectedTags.forEach(tagId => insertTagsDataArray.push(reviewId, tagId));
    } else {
        deleteTagsQuery = `DELETE FROM review_tags WHERE review_id = $1`;
        deleteTagsDataArray = [reviewId];
    }

    let initialQuery = `UPDATE trophies SET review_id = data.review_id FROM ( VALUES `;
    let querySegment = queryGenerator(initialQuery, trophies.length, 2, 1, true);
    let updateTrophiesQuery = querySegment += `) AS data(trophy_id, review_id) WHERE trophies.trophy_id = data.trophy_id AND trophies.user_set_id = $1`;

    let updateTrophiesDataArray = [(userSetId)]; 
    trophies.forEach(trophy => updateTrophiesDataArray.push((trophy.trophy_id), (trophy.review_id)));

    try {

        await transaction.query("BEGIN");

        await transaction.query(patchCardQuery, patchCardDataArray);
        await transaction.query(deleteTagsQuery, deleteTagsDataArray);
        if (selectedTags.length > 0) {
            await transaction.query(insertTagsQuery, insertTagsDataArray);
        }
        await transaction.query(updateTrophiesQuery, updateTrophiesDataArray);
        
        await transaction.query("COMMIT");

    } catch (err) {

        await transaction.query("ROLLBACK");

    } finally {
        transaction.release();
    }
}

export default { getSetReview, getSetReviewCardsEdit, postSetReviewCardsEdit, getAllSetReviews, createSetReview, deleteSetReview, getSets, getReviewsWithCards, getSetReviewTrophies, putSetReviewTrophies, getTrophiesFromReview, assignTrophiesToReview,
                 getCardFromSetReview, getSetReviewTags, patchCardFromSetReview, patchCardFromSetReviewByReviewId, performPageUpdate, getReviewPageInformation };