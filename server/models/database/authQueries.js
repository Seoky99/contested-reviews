import pool from "../pool.js"; 

async function checkDuplicateUser(username, email) {
    const query = `SELECT * FROM users WHERE username = $1 OR email = $2`;
    try {
        const { rows } = await pool.query(query, [username, email]);
        return rows; 
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function registerUser(username, email, hashedPassword) {
    const query = `INSERT INTO users(username, email, password)
                   VALUES ($1, $2, $3)`;
    
    try {
        await pool.query(query, [username, email, hashedPassword]);
    } catch (err) {
        console.log(err);
    }
}

async function findUserFromUsername(username) {
    const query = `SELECT * FROM users WHERE username=$1`;
    
    try {
        const { rows } = await pool.query(query, [username]);
        return rows; 
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function verifyAccessToUserSet(userId, userSetId) {
    const query =  `SELECT * FROM user_sets WHERE user_id = $1 AND user_set_id = $2`;

    try {
        const { rows } = await pool.query(query, [userId, userSetId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

async function verifyAccessToReview(userId, reviewId) {
    const query = `SELECT reviews.review_id FROM reviews 
                   JOIN user_sets ON user_sets.user_set_id = reviews.user_set_id
                   WHERE user_sets.user_id = $1 AND reviews.review_id = $2`;
    
    try {
        const { rows } = await pool.query(query, [userId, reviewId]); 
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

async function verifyAccessToTag(userId, tagId) {
    const query = `SELECT * FROM tags WHERE user_id = $1 AND tag_id = $2`;

    try {
        const { rows } = await pool.query(query, [userId, tagId]); 
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

export default { checkDuplicateUser, registerUser, findUserFromUsername, verifyAccessToUserSet, verifyAccessToReview, 
    verifyAccessToTag
 };