import pool from "../pool.js"; 
import queryGenerator from "../config/queryGenerator.js";

async function getAllTrophies(userId) {
    const query = `SELECT * FROM trophies WHERE user_id = $1 OR user_id IS NULL`;

    try {
        const { rows } = await pool.query(query, [userId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

async function addTrophiesToReview(userId, reviewId, trophyIds) {
    const query = `UPDATE trophies SET reviewId = $2 WHERE user_id = $1 OR user_id IS NULL`;

}

export default { getAllTrophies }; 