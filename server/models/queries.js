import pool from "./pool.js"; 

async function getAllSetReviews(userid) {

    const query = `SELECT user_sets.name AS set_review_name, set_code, sets.name AS set_name, user_set_id, user_set_img 
                    FROM user_sets JOIN sets ON user_sets.set_id = sets.set_id 
                    WHERE user_id = $1`;

    try {

        const { rows } = await pool.query(query, [userid]);
        return rows; 

    } catch (err) {
        console.log(err);
    }
}

async function createSetReview(userid, setid, name) {

    const query = `INSERT INTO user_sets(user_id, set_id, name) VALUES ($1, $2, $3)`;

    try {

        await pool.query(query, [userid, setid, name]);

    } catch (err) {
        console.log(err);
    }
}

async function getSets() {

    const query = `SELECT * FROM sets`;

    try {

        const { rows } = await pool.query(query);
        return rows; 

    } catch (err) {
        console.log(err);
    }

}

export default { getAllSetReviews, createSetReview, getSets };