import db from "../models/database/tagQueries.js";
import ndb from "../models/database/queries.js";
import extractCardFromRows from "./utils/extractCardFromRows.js";
import { verifyAccessToReview } from "./utils/verify.js";

/**
 * Returns all the necessary information to render the page: based on the userId, reviewId, a user's 
 * tags, trophies, card details - (rank, notes)
 */
async function getPageInformation(req, res) {
    const userId = req.userId; 
    const { reviewid } = req.params; 

    if (!(await verifyAccessToReview(userId, reviewid))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this review."})
    }
    
    const { cardDetails, reviewTags, allTags, trophies } = await ndb.getReviewPageInformation(reviewid, userId);

    function camelCaseChange(rows) {
    const camelCase = rows.map(row => {
        return {
            userId: row.user_id,
            tagName: row.name, 
            userSetId: row.user_set_id,
            tagId: row.tag_id,
            tagCount: Number(row.count)
        }});
        return camelCase;     
    }

    const transformedCardDetails = extractCardFromRows(cardDetails)[0];
    const ccReviewTags = camelCaseChange(reviewTags); 
    const ccAllTags = camelCaseChange(allTags);

    res.json({cardDetails: transformedCardDetails, reviewTags: ccReviewTags, setTags: ccAllTags, trophies});
}

/**
 * "One shot" transaction update of the page information (rank, notes, tags, trophies). If any individual parts fail, it will be rollbacked. 
 */
async function updatePageInformation(req, res) {
    const userId = req.userId; 

    const { reviewid } = req.params;
    let { rank, notes, selectedTags, trophies, userSetId } = req.body;  

    if (!(await verifyAccessToReview(userId, reviewid))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this review."})
    }

    trophies = trophies.map(trophy => ({ trophy_id: trophy.trophy_id, review_id: trophy.review_id})); 

    await ndb.performPageUpdate({reviewId: reviewid, rank, notes, selectedTags, trophies, userSetId});

    res.json({rank, notes, selectedTags, trophies});
}

async function assignTagToReview(req, res) {

    //implement authentication 
    const userId = 1; 

    const { reviewid } = req.params; 
    const { tagIds } = req.body; 

    const rows = await db.assignTagToReview(reviewid, tagIds); 

    const camelCaseChange = rows.map(row => {
        return {
            reviewId: row.review_id,
            tagId: row.tag_id, 
        }    
    })
    res.json(camelCaseChange);
}

async function getTagsFromReview(req, res) {

    //implement authentication 
    const userId = 1; 

    const { reviewid } = req.params; 

    const rows = await db.getTagsFromReview(userId, reviewid); 
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

async function getTrophiesFromReview(req, res) {
    
    //implement authentication 
    const userId = 1; 

    const { reviewid } = req.params; 

    const rows = await ndb.getTrophiesFromReview(reviewid); 

    res.json(rows);
}

async function assignTrophiesToReview(req, res) {
    
    //implement authentication 
    const userId = 1; 

    const { reviewid } = req.params; 
    const { trophyIds } = req.body; 

    await ndb.assignTrophiesToReview(reviewid, trophyIds); 

    res.json(trophyIds);
}


async function deleteTagsFromReview(req, res) {

    const userId = 1; 

    const { reviewid, tagid } = req.params; 

    await db.deleteTagsFromReview(reviewid, tagid); 
    /*const camelCaseChange = rows.map(row => {
        return {
            userId: row.user_id,
            tagName: row.name, 
            setId: row.set_id,
            tagId: row.tag_id
        }    
    }) */
   
    res.status(204).send();
}


export { assignTagToReview, getTagsFromReview, deleteTagsFromReview, getPageInformation, updatePageInformation, getTrophiesFromReview, assignTrophiesToReview }