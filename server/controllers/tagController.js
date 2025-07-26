import db from "../models/database/tagQueries.js";
import { verifyAccessToUserSet, verifyAccessToTag } from "./utils/verify.js";

/**
 * Creates a tag with tagName in the specified set review with userSetId
 * @returns Object to reconstruct tag: {userSetId: int, tagName: string, userId : int, tagId: int}
 */
async function createTag(req, res) {
    const userId = req.userId; 

    const { userSetId, tagName } = req.body;  
    if (!(await verifyAccessToUserSet(userId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this user set."})
    }

    const rows = await db.createTag(userId, userSetId, tagName); 
    const tagId = rows[0].tag_id;
    res.json({userSetId, tagName, userId, tagId});
}

/**
 * Deletes the tag with tagId from userId  
 * @param {} req 
 * @param {*} res 
 */
async function deleteTag(req, res) {
    const userId = req.userId; 

    const { tagid } = req.params; 
    if (!(await verifyAccessToTag(userId, tagid))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this tag."})
    }

    await db.deleteTag(userId, tagid); 

    res.sendStatus(204);
}

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

async function patchTag(req, res) {
    //implement authentication 
    const userId = 1; 

    const { tagid } = req.params; 
    const { tagName } = req.body; 

    await db.patchTag(userId, tagid, tagName); 
    
    res.json({tagid, tagName});
}

export { getAllUserTags, createTag, patchTag, deleteTag };