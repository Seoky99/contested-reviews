import db from "../models/queries.js";

async function getSetReviews(req, res) {

    //implement authentication 
    const userid = 1; 

    const rows = await db.getAllSetReviews(userid);
    res.json(rows); 
}

/**
 * Creates a set review instance for a user, taking in a POST body of: 
 *  setid - id of set 
 *  name - user's choice to name the set instance 
 *  defaultApplied - Applies 'C' to commons, 'B' to uncommons, 'A' to rares, and 'S' to mythics 
 *  bonusAdded - Add the bonus sheets / other draft legal variations to the set review
 */
async function createSetReview(req, res) {

    //implement authentication 
    const userid = 1; 

    const { setid, name } = req.body; 
    const defaultApplied = 'defaultApplied' in req.body; 
    const bonusAdded = 'bonusAdded' in req.body; 

    await db.createSetReview(userid, setid, name, defaultApplied, bonusAdded);
    res.json({setid, name});

}

export { getSetReviews, createSetReview } ; 