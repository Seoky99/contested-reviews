import db from "../models/database/tagQueries.js";

async function getAllUserTags (req, res) {

    //implement authentication 
    const userId = 1; 

    const rows = await db.getAllUserTags(userId); 
    res.json(rows);
}

async function createTag(req, res) {
    //implement authentication 
    const userId = 1; 

    const { setId, tagName } = req.body;  

    await db.createTag(userId, setId, tagName); 
    res.json({setId, tagName});
}

async function patchTag(req, res) {
    //implement authentication 
    const userId = 1; 

    const { tagid } = req.params; 
    const { tagName } = req.body; 

    await db.patchTag(userId, tagid, tagName); 
    
    res.json({tagid, tagName});
}

async function deleteTag(req, res) {

    //implement authentication 
    const userId = 1; 

    const { tagid } = req.params; 

    await db.deleteTag(userId, tagid); 

    res.status(204).send()
}

export { getAllUserTags, createTag, patchTag, deleteTag };