import db from "../models/database/tagQueries.js";

async function getAllUserTags (req, res) {

    //implement authentication 
    const userId = 1; 

    const rows = await db.getAllUserTags(userId); 

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

async function createTag(req, res) {
    //implement authentication 
    const userId = 1; 

    const { userSetId, tagName } = req.body;  

    const rows = await db.createTag(userId, userSetId, tagName); 
    const tagId = rows[0].tag_id;
    res.json({userSetId, tagName, userId, tagId});
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