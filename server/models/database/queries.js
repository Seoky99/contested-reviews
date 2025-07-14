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
    const query = `SELECT user_sets.name AS set_review_name, set_code, sets.name AS set_name, user_set_id, user_set_img 
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

/**
 * Creates a set review with the specified name and parameters.
 * Then, creates ratings for all the cards in the set - if default, a specified Rank, otherwise null. 
 * @param {number} userid 
 * @param {string} setid 
 * @param {string} name 
 * @param {boolean} defaultApplied - Ranking specified by defaultRatings object 
 * @param {boolean} bonusAdded - Bonus draft legal cards also make it into the set, populates bonus_links
 */
async function createSetReview(userid, setid, name, defaultApplied, bonusAdded) {
    const query = `INSERT INTO user_sets(user_id, set_id, name, default_applied, includes_bonus) VALUES ($1, $2, $3, $4, $5)
                    RETURNING user_set_id`;

    try {
        const { rows } = await pool.query(query, [userid, setid, name, defaultApplied, bonusAdded]);
        const userSetId = rows[0].user_set_id;

        //TODO: add constraint on name 
        const {rows:[{ user_set_id }]} = await pool.query(`SELECT user_set_id FROM user_sets WHERE user_id = $1 AND name = $2;`, [userid, name]);

        //I LOVE BONUS SHEETS! I LOVE BONUS SHEETS! (going insane)
        const { rows: cards } = await pool.query(`SELECT * FROM cards WHERE set_id = $1${bonusAdded ? ` OR set_id IN
         (SELECT bonus_set_id FROM bonus_links WHERE main_set_id = $1)`: ``}`, [setid]);
  
        let reviewQuery = `INSERT INTO reviews(user_set_id, card_id, rank) VALUES `;
        
        const dataArray = []; 
        let count = 0; 
        const numColsInserted = 3;
        
        cards.forEach( (card, i) => {
            let querySegment = `(`; 

            for (let colCount = 0; colCount < numColsInserted; colCount++) {
                count++;
                querySegment += `$${count}${colCount === numColsInserted - 1 ? `` : `, `}`;
            }
            
            querySegment += `)${i === cards.length - 1 ? `` : `,`}`;
            reviewQuery += querySegment;

            dataArray.push(user_set_id, card.card_id);
            defaultApplied ? dataArray.push(rarityMap[card.rarity]) : dataArray.push("NR");
        });

        await pool.query(reviewQuery, dataArray);

        //Generating trophy data for set review 
        const initialTQuery = `INSERT INTO trophies(user_set_id, name, description, trophy_img_url) VALUES `;
        let trophyQuery = queryGenerator(initialTQuery, trophyData.length, 4);
        trophyQuery += ` ON CONFLICT DO NOTHING`; 

        const trophyDataArray = []; 
        trophyData.forEach(trophy => trophyDataArray.push(userSetId, ...trophy));

        await pool.query(trophyQuery, trophyDataArray);
        
    } catch (err) {
        console.log(err);
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
    const query = `SELECT * FROM reviews JOIN cards ON cards.card_id = reviews.card_id 
                   JOIN faces ON cards.card_id = faces.card_id WHERE user_set_id = $1;`;
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
    const query = `SELECT * FROM trophies WHERE user_set_id = $1`

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

async function performPageUpdate(pageInformation) {

    const {reviewId, rank, notes, selectedTags} = pageInformation;
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

    try {

        await transaction.query("BEGIN");

        await transaction.query(patchCardQuery, patchCardDataArray);
        await transaction.query(deleteTagsQuery, deleteTagsDataArray);
        if (selectedTags.length > 0) {
            await transaction.query(insertTagsQuery, insertTagsDataArray);
        }
        
        await transaction.query("COMMIT");

    } catch (err) {

        await transaction.query("ROLLBACK");

    } finally {
        await transaction.release();
    }

}

export default { getAllSetReviews, createSetReview, deleteSetReview, getSets, getReviewsWithCards, getSetReviewTrophies, putSetReviewTrophies, getTrophiesFromReview, assignTrophiesToReview,
                 getCardFromSetReview, patchCardFromSetReview, patchCardFromSetReviewByReviewId, performPageUpdate };