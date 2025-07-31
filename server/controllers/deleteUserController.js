import db from "../models/database/authQueries.js"

async function deleteUser(req, res) {
    const userId = req.userId; 

    await db.deleteUser(userId);

    //TODO: Front-end: delete the access token!
    //IN production, add secure: true 
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: process.env.NODE_ENV === 'production'
    })

    return res.sendStatus(204);
}

export { deleteUser };