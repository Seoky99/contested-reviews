import db from '../models/database/queries.js';

async function getSets(req, res) {
    const sets = await db.getSets();
    res.json(sets); 
}

export { getSets };