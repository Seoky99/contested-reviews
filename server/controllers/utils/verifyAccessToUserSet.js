import db from "../../models/database/authQueries.js";

async function verifyAccessToUserSet(userId, setId) {
    const accessExists = await db.verifyAccessToUserSet(userId, setId);
    return accessExists.length === 1;
}

export default verifyAccessToUserSet;