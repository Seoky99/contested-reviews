import db from "../models/database/tagQueries.js";
import ndb from "../models/database/queries.js";

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

async function getPageInformation(req, res) {

    //implement authentication 
    const userid = 1; 

    const { reviewid } = req.params; 
    

    return 2; 
}

async function updatePageInformation(req, res) {

    //implement authentication 
    const userid = 1; 

    const { reviewid } = req.params;
    let { rank, notes, selectedTags, trophies, userSetId } = req.body;  

    trophies = trophies.map(trophy => ({ trophy_id: trophy.trophy_id, review_id: trophy.review_id})); 

    await ndb.performPageUpdate({reviewId: reviewid, rank, notes, selectedTags, trophies, userSetId});

    res.json({rank, notes, selectedTags});
}

export { assignTagToReview, getTagsFromReview, deleteTagsFromReview, getPageInformation, updatePageInformation, getTrophiesFromReview, assignTrophiesToReview }