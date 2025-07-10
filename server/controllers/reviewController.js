import db from "../models/database/tagQueries.js";

async function createTag(req, res) {

    //implement authentication 
    const userId = 1; 

    const rows = await db.createTag(userId); 
    
    res.json(rows);
}

async function getAllUserTags (req, res) {

    //implement authentication 
    const userId = 1; 

    const rows = await db.getAllUserTags(userId); 
    res.json(rows);
}

export { getAllUserTags }