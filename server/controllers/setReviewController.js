import db from "../models/database/queries.js";
import statsdb from "../models/database/statsQueries.js";
import extractCardFromRows from "./utils/extractCardFromRows.js";
import ratingsNumericMap from "./utils/ratingsNumericMap.js";
import {verifyAccessToUserSet} from "./utils/verify.js";

/**
 * Returns all set review information belonging to the user
 */
async function getSetReviews(req, res) {
    const userId = req.userId; 
    const rows = await db.getAllSetReviews(userId);
    res.json(rows); 
}

/**
 * Creates a set review instance for a user, taking in a POST body of: 
 *  setid {number} - id of set 
 *  name {string} - user's choice to name the set instance 
 *  defaultApplied {boolean} - Applies default ratings according to defaultRatings object (ex. C for commons)
 *  bonusAdded {boolean} - Add the bonus sheets / other draft legal variations to the set review
 *  makeShard {boolean} - Creates a set review skeleton that has zero reviews in it 
 */
async function createSetReview(req, res) {
    const userId = req.userId; 
    const { sr_name, setid } = req.body; 
    
    //sent via checkbox in the form 
    const defaultApplied = 'defaultApplied' in req.body; 
    const bonusAdded = 'bonusAdded' in req.body; 
    const makeShard = 'makeShard' in req.body; 

    const {user_set_img, name, user_set_id } = await db.createSetReview(userId, setid, sr_name, defaultApplied, bonusAdded, makeShard);
    res.json({user_set_img, name, user_set_id});
}

/**
 * Takes in the userSetId from params, returns an array of elements that contain card and review info
 * Return format: array of objects containing card info { cmc, collectorNumber, etc... }. Notably, it contains fields 
 * {...tags: [userTags], faces: [faceSpecificInfo]}
 * Faces contain card images, names, and more. 
 */
async function getSetReviewCards(req, res) {
    //implement authentication 
    const userId = req.userId;
    const { setid } = req.params;

    if (!(await verifyAccessToUserSet(userId, setid))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this set review."})
    }

    const rows = await db.getReviewsWithCards(setid);
    const cards = extractCardFromRows(rows); 

    res.json(cards);
}

/**
 * Returns all the cards available in a set: based on the user set's options (bonusAdded or not)
 * The information of all the already reviewed cards comes along with the cards (rank, tags), for non-reviewed cards, it is null 
 * @returns 
 */
async function getSetReviewCardsEdit(req, res) {
    const userId = req.userId; 

    const { setid } = req.params; 
    if (!(await verifyAccessToUserSet(userId, setid))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this set review."})
    }

    const { allCards: cards } = await db.getSetReviewCardsEdit(setid);
    const allCards = extractCardFromRows(cards); 

    return res.json(allCards);
}

/**
 * Req body takes in an array of card ids to add, and a list of card ids to remove from the user set.  
 * Database adds with default applied based on the user preference
 */
async function postSetReviewCardsEdit(req, res) {
    const userId = req.userId;  

    const { setid } = req.params; 
    if (!(await verifyAccessToUserSet(userId, setid))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this set review."})
    }
    const { added, removed } = req.body; 

    await db.postSetReviewCardsEdit(setid, added, removed);

    res.json({success: true});
}

/**
 * Deletes the set review corresponding to userSetId, as long as userId owns it. 
 * @returns 
 */
async function deleteSetReview(req, res) {    
    const userId = req.userId; 

    const { setid } = req.params; 
    if (!(await verifyAccessToUserSet(userId, setid))) {
        return res.status(403).json({message: "Forbidden: You don't have permissions to delete this set review."})
    }

    await db.deleteSetReview(setid); 
    res.sendStatus(204); 
}

/**
 * Returns all the trophies associated with the user set 
 */
async function getSetReviewTrophies(req, res) {
    const userId = req.userId; 

    const { setid } = req.params; 

    if (!(await verifyAccessToUserSet(userId, setid))) {
        return res.status(403).json({message: "Forbidden: You don't have access to these trophies."})
    }    
    const rows = await db.getSetReviewTrophies(setid);
    res.json(rows); 
}

/**
 * TODO:// Finish this 
 * Averages the ratings of each color 
 */
async function getSetReviewStatsColors(req, res) {
    const userId = req.userId; 

    const { setid } = req.params; 

    if (!(await verifyAccessToUserSet(userId, setid))) {
        return res.status(403).json({message: "Forbidden: You don't have access to these stats."})
    }

    const rows = await statsdb.getRatedReviews(setid); 

    const colorMap = new Map(); 

    rows.forEach( row => {

        let colorKey = ""; 

        if (row.colors.length < 1) {
            if (row.types.includes("Land")) {
                colorKey = "L"; 
            } else {
                colorKey = "C"; 
            }
        } else {
            colorKey = row.colors.join(",");
        }

        colorKey += ` - ${row.rarity}`; 

        if (!colorMap.has(colorKey)) {
            colorMap.set(colorKey, []);
        }

        colorMap.get(colorKey).push(ratingsNumericMap[row.rank]);
    })

    const raw = Array.from(colorMap);

    const averages = {};

    for (const [color, scores] of raw) {
        let sum = 0;
        for (let i = 0; i < scores.length; i++) {
            sum += scores[i];
        }
        averages[color] = scores.length > 0 ? sum / scores.length : null;
    }

    res.json(averages);
}

/**
 * Gets the set review and information associated with the set 
 */
async function getSetReview(req, res) {
    const userId = req.userId; 

    const { setid } = req.params; 
    if (!(await verifyAccessToUserSet(userId, setid))) {
        return res.status(403).json({message: "Forbidden: You don't have access to the set review."})
    }

    const rows = await db.getSetReview(userId, setid);

    res.json(rows[0]); 
}


async function getSetReviewTags(req, res) {

    //implement authentication 
    const userid = 1; 

    const { setid } = req.params;

    const rows = await db.getSetReviewTags(setid);

    const camelCaseChange = rows.map(row => {
        return {
            userId: row.user_id,
            tagName: row.name, 
            userSetId: row.user_set_id,
            tagId: row.tag_id
        }    
    })

    res.json(camelCaseChange);
}


async function putSetReviewTrophies(req, res) {
    
    //implement authentication 
    const userid = 1; 

    const { setid } = req.params; 
    const trophies = req.body; 

    await db.putSetReviewTrophies(setid, trophies); 
    res.json(trophies); 
}

/**
 * Takes in the user's set id and card id from the url and returns the appropiate card 
 */
async function getCardPageInformation(req, res) {

    //implement authentication 
    const userid = 1; 

    const { setid, cardid } = req.params; 

    const rows = await db.getCardFromSetReview(setid, cardid);
    const card = extractCardFromRows(rows)[0];

    res.json(card);
}

/**
 * Takes in the appropiate set id, card id from the url and updates the card based on the
 * PATCH body of: rank {string}, notes {string} 
 */
async function patchCardFromSetReview(req, res) {

    //implement authentication 
    const userid = 1; 

    const { setid, cardid } = req.params;
    const { rank, notes } = req.body; 

    await db.patchCardFromSetReview(setid, cardid, rank, notes);

    //there should be only one row ideally 
    res.json(JSON.stringify({rank, notes}));
}


export { getSetReview, getSetReviewCardsEdit, postSetReviewCardsEdit, getSetReviews, createSetReview, 
         deleteSetReview, getSetReviewCards, getCardPageInformation, patchCardFromSetReview, 
         getSetReviewTags, getSetReviewTrophies, putSetReviewTrophies, getSetReviewStatsColors } ; 