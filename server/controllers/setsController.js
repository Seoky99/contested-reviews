import db from '../models/queries.js';

async function getSets(req, res) {

    const sets = await db.getSets();
    res.json(sets); 

}

export { getSets };