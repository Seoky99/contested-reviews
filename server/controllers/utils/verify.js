import db from "../../models/database/authQueries.js";

async function verifyAccessToUserSet(userId, setId) {
    const accessExists = await db.verifyAccessToUserSet(userId, setId);
    return accessExists.length === 1;
}

async function verifyAccessToReview(userId, reviewId) {
    const accessExists = await db.verifyAccessToReview(userId, reviewId); 
    return accessExists.length === 1; 
}

async function verifyAccessToTag(userId, tagId) {
    const accessExists = await db.verifyAccessToTag(userId, tagId); 
    return accessExists.length === 1; 
}

async function verifyAccessToPods(userId, podIds) {
    const accessExists = await db.verifyAccessToPods(userId, podIds);
    return accessExists.length === podIds.length; 
}

export { verifyAccessToUserSet, verifyAccessToReview, verifyAccessToTag, verifyAccessToPods } ;