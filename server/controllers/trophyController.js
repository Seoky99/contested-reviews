import db from "../models/database/trophyQueries.js"

/**
 * Gets all user trophies for a set review and global trophies
 * @param {} req 
 * @param {*} res 
 */
async function getAllSetReviewTrophies(req, res) {

    //implement authentication 
    const userId = 1; 

    const { userSetId } = req.params; 

    const rows = await db.getAllTrophies(userSetId);
    return res.json(rows); 
} 

async function addTrophiesToReview(req, res) {

    //implement authentication
    const userId = 1; 

    const { reviewid } = req.params; 
    const { trophyIds } = req.body; 

    const rows = await db.addTrophiesToReview(userId, reviewid, trophyIds); 
    return res.json(rows); 
}

export { }; 