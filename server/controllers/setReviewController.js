import db from "../models/database/queries.js";
import statsdb from "../models/database/statsQueries.js";
import extractCardFromRows from "./utils/extractCardFromRows.js";
import extractPodIdsFromRows from "./utils/extractPodIdsFromRows.js";
import { verifyAccessToUserSet, verifyAccessToPods } from "./utils/verify.js";
import { calculateAveragesPerColor } from "./utils/calculateAveragesPerColor.js";

/**
 * Returns all set review information belonging to the user
 */
async function getSetReviews(req, res) {
    const userId = req.userId; 

    //Result contains multiple rows for each different pod id, coalesce to one review contains info of [podid, podid]
    const rows = await db.getAllSetReviews(userId);
    const rowsGrouped = extractPodIdsFromRows(rows);

    res.json(rowsGrouped); 
}

/**
 * Creates a set review instance for a user, taking in a POST body of: 
 *  userSetId {number} - id of set 
 *  name {string} - user's choice to name the set instance 
 *  defaultApplied {boolean} - Applies default ratings according to defaultRatings object (ex. C for commons)
 *  bonusAdded {boolean} - Add the bonus sheets / other draft legal variations to the set review
 *  makeShard {boolean} - Creates a set review skeleton that has zero reviews in it 
 */
async function createSetReview(req, res) {
    const userId = req.userId; 
    const { setReviewName, setId, defaultApplied, bonusAdded, makeShard } = req.body; 

    const {user_set_img, name, user_set_id } = await db.createSetReview(userId, setId, setReviewName, defaultApplied, bonusAdded, makeShard);
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
    const { userSetId } = req.params;

    if (!(await verifyAccessToUserSet(userId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this set review."})
    }

    const rows = await db.getReviewsWithCards(userSetId);
    const cards = extractCardFromRows(rows); 

    res.json(cards);
}

/**
 * Returns all the cards available in a set: based on the user set's options (bonusAdded or not)
 * The information of all the already reviewed cards comes along with the cards (rank, tags), for non-reviewed cards, it is null 
 */
async function getSetReviewCardsEdit(req, res) {
    const userId = req.userId; 

    const { userSetId } = req.params; 
    if (!(await verifyAccessToUserSet(userId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this set review."})
    }

    const { allCards: cards } = await db.getSetReviewCardsEdit(userSetId);
    const allCards = extractCardFromRows(cards); 

    return res.json(allCards);
}

/**
 * Req body takes in an array of card ids to add, and a list of card ids to remove from the user set.  
 * Database adds with default applied based on the user preference
 */
async function postSetReviewCardsEdit(req, res) {
    const userId = req.userId;  

    const { userSetId } = req.params; 
    if (!(await verifyAccessToUserSet(userId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this set review."})
    }
    const { added, removed } = req.body; 

    await db.postSetReviewCardsEdit(userSetId, added, removed);

    res.json({success: true});
}

/**
 * Deletes the set review corresponding to userSetId, as long as userId owns it. 
 * @returns 
 */
async function deleteSetReview(req, res) {    
    const userId = req.userId; 

    const { userSetId } = req.params; 
    if (!(await verifyAccessToUserSet(userId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have permissions to delete this set review."})
    }

    await db.deleteSetReview(userSetId); 
    res.sendStatus(204); 
}

/**
 * Returns all the trophies associated with the user set 
 */
async function getSetReviewTrophies(req, res) {
    const userId = req.userId; 

    const { userSetId } = req.params; 

    if (!(await verifyAccessToUserSet(userId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to these trophies."})
    }    
    const rows = await db.getSetReviewTrophies(userSetId);
    res.json(rows); 
}

/**
 * TODO:// Finish this 
 * Averages the ratings of each color 
 */
async function getSetReviewStatsColors(req, res) {
    const userId = req.userId; 

    const { userSetId } = req.params; 

    if (!(await verifyAccessToUserSet(userId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to these stats."})
    }

    const rows = await statsdb.getRatedReviews(userSetId); 

    const averages = calculateAveragesPerColor(rows);

    res.json(averages);
}

/**
 * Gets the set review and information associated with the set 
 */
async function getSetReview(req, res) {
    const userId = req.userId; 

    const { userSetId } = req.params; 
    if (!(await verifyAccessToUserSet(userId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to the set review."})
    }

    const rows = await db.getSetReview(userId, userSetId);

    res.json(rows[0]); 
}

/**
 * 
 */
async function assignSetReviewToPods(req, res) {
    const userId = req.userId; 

    const { userSetId } = req.params; 
    const { podIds } = req.body; 

    if (!(await verifyAccessToUserSet(userId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to the set review."})
    }

    if (!(await verifyAccessToPods(userId, podIds))) {
        return res.status(403).json({message: "Forbidden: You are not a member of these pods"})
    }

    await db.assignSetReviewToPods(userSetId, podIds); 

    res.json(podIds);
}

async function removeSetReviewFromPods(req, res) {
    const userId = req.userId; 

    const { userSetId } = req.params; 

    if (!(await verifyAccessToUserSet(userId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to the set review."})
    }

    await db.removeSetReviewFromPods(userSetId); 

    res.sendStatus(204);
}

async function getSetReviewOverview(req, res) {
    const userId = req.userId; 

    const { userSetId } = req.params;

    if (!(await verifyAccessToUserSet(userId, userSetId))) {
            return res.status(403).json({message: "Forbidden: You don't have access to this overview."})
    }

    const [trophies, colorStats, setReviewInfo] = await Promise.all([
        db.getSetReviewTrophies(userSetId),
        statsdb.getRatedReviews(userSetId),
        db.getSetReview(userId, userSetId)
    ]);

    const stats = calculateAveragesPerColor(colorStats);
    const setReviewData = setReviewInfo[0]

    res.json({trophies, stats, setReviewData});
}


/**
 * Takes in the appropiate set id, card id from the url and updates the card based on the
 * PATCH body of: rank {string}, notes {string} 
async function patchCardFromSetReview(req, res) {

    //implement authentication 
    const userid = 1; 

    const { userSetId, cardid } = req.params;
    const { rank, notes } = req.body; 

    await db.patchCardFromSetReview(userSetId, cardid, rank, notes);

    //there should be only one row ideally 
    res.json(JSON.stringify({rank, notes}));
} */

/*async function putSetReviewTrophies(req, res) {
    
    //implement authentication 
    const userid = 1; 

    const { userSetId } = req.params; 
    const trophies = req.body; 

    await db.putSetReviewTrophies(userSetId, trophies); 
    res.json(trophies); 
} */

/*
async function getSetReviewTags(req, res) {
    //implement authentication 
    const userid = 1; 

    const { userSetId } = req.params;

    const rows = await db.getSetReviewTags(userSetId);

    const camelCaseChange = rows.map(row => {
        return {
            userId: row.user_id,
            tagName: row.name, 
            userSetId: row.user_set_id,
            tagId: row.tag_id
        }    
    })

    res.json(camelCaseChange);
} */

/**
 * Takes in the user's set id and card id from the url and returns the appropiate card 
 
async function getCardPageInformation(req, res) {

    //implement authentication 
    const userid = 1; 

    const { userSetId, cardid } = req.params; 

    const rows = await db.getCardFromSetReview(userSetId, cardid);
    const card = extractCardFromRows(rows)[0];

    res.json(card);
} */


export { getSetReview, getSetReviewCardsEdit, postSetReviewCardsEdit, getSetReviews, createSetReview, 
         deleteSetReview, getSetReviewCards, getSetReviewTrophies, getSetReviewStatsColors, 
         assignSetReviewToPods, getSetReviewOverview, removeSetReviewFromPods } ; 