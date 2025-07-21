import pool from "../pool.js"; 

async function getRatedReviews(userSetId) {
    const query = `SELECT faces.colors, faces.types, rarity, reviews.rank 
                   FROM reviews 
                   JOIN cards ON cards.card_id = reviews.card_id 
                   JOIN faces ON faces.card_id = cards.card_id 
                   WHERE user_set_id = $1 AND rank IS NOT NULL AND rank != 'NR'`;
    try {
        const {rows} = await pool.query(query, [userSetId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

export default { getRatedReviews }