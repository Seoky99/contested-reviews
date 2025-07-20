import db from "../models/database/queries.js";
import extractCardFromRows from "./utils/extractCardFromRows.js";

async function getSetReviewCardsEdit(req, res) {
    //implement authentication 
    const userid = 1; 

    const { setid } = req.params; 

    const { allCards: cards } = await db.getSetReviewCardsEdit(setid);
    const allCards = extractCardFromRows(cards); 

    return res.json({allCards});
}

async function postSetReviewCardsEdit(req, res) {
    //imlpement authentication 
    const userid = 1; 

    const { setid } = req.params; 
    const { added, removed } = req.body; 

    await db.postSetReviewCardsEdit(setid, added, removed);

    res.json({success: true});
}

async function getSetReviews(req, res) {

    //implement authentication 
    const userid = 1; 

    const rows = await db.getAllSetReviews(userid);

    res.json(rows); 
}

/**
 * Creates a set review instance for a user, taking in a POST body of: 
 *  setid {number} - id of set 
 *  name {string} - user's choice to name the set instance 
 *  defaultApplied {boolean} - Applies default ratings according to defaultRatings object (ex. C for commons)
 *  bonusAdded {boolean} - Add the bonus sheets / other draft legal variations to the set review
 */
async function createSetReview(req, res) {

    //implement authentication 
    const userid = 1; 

    const { sr_name, setid } = req.body; 
    
    //sent via checkbox in the form 
    const defaultApplied = 'defaultApplied' in req.body; 
    const bonusAdded = 'bonusAdded' in req.body; 
    const makeShard = 'makeShard' in req.body; 

    const {user_set_img, name, user_set_id } = await db.createSetReview(userid, setid, sr_name, defaultApplied, bonusAdded, makeShard);
    res.json({user_set_img, name, user_set_id});
}

async function deleteSetReview(req, res) {
    
    //implement authentication - check if user id matches 
    const userid = 1; 

    const { setid } = req.params; 

    await db.deleteSetReview(setid); 
    res.status(204).send(); 
}

/**
 * Takes in the user's set id from the url and returns the appropiate user set 
 */
async function getSetReviewCards(req, res) {

    //implement authentication 
    const userid = 1; 

    const { setid } = req.params;

    const rows = await db.getReviewsWithCards(setid);
    const cards = extractCardFromRows(rows); 

    res.json(cards);
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

async function getSetReviewTrophies(req, res) {

    //implement authenticaiton 
    const userid = 1; 

    const { setid } = req.params; 
    
    const rows = await db.getSetReviewTrophies(setid);
    res.json(rows); 
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


export { getSetReviewCardsEdit, postSetReviewCardsEdit, getSetReviews, createSetReview, deleteSetReview, getSetReviewCards, getCardPageInformation, 
    patchCardFromSetReview, getSetReviewTags, getSetReviewTrophies, putSetReviewTrophies } ; 