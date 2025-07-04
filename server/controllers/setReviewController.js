import db from "../models/queries.js";

async function getSetReviews(req, res) {

    //implement authentication 
    const userid = 1; 

    const rows = await db.getAllSetReviews(userid);
    res.json(rows); 
}

async function createSetReview(req, res) {

    //implement authentication 
    const userid = 1; 

    const { setid, name } = req.body; 

    await db.createSetReview(userid, setid, name);
    res.json({setid, name}); 

}

export { getSetReviews, createSetReview } ; 