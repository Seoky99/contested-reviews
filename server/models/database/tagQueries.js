import pool from "../pool.js"; 

async function createTag(userId, setId, tagName) {
    const query = `INSERT INTO tags (user_id, set_id, name) VALUES ($1, $2, $3)`;

    try {
        await pool.query(query, [userId, setId, tagName]);
    } catch (err) {
        console.log(err);
    }
}

async function getAllUserTags(userId) {
    const query = `SELECT * FROM tags WHERE user_id = $1`;

    try {
        const { rows } = await pool.query(query, [userId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

async function assignTagToReview(reviewId, tagId) {
    const query = `INSERT INTO review_tags(review_id, tag_id) VALUES ($1, $2);`;

    try {
        const { rows } = await pool.query(query, [reviewId, tagId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

async function getTagsFromReview(userId, reviewId) {
    const query = `SELECT * FROM review_tags WHERE user_id = $1 AND review_id = $2`;

    try {
        const { rows } = await pool.query(query, [userId, reviewId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

async function patchTag(userId, tagId, tagName) {

    const query = `UPDATE tags SET name = $3 WHERE user_id = $1 AND tag_id = $2`;
    
    try {
        const { rows } = await pool.query(query, [userId, tagId, tagName]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

async function deleteTag(userId, tagId) {
    const query = `DELETE FROM tags WHERE user_id = $1 AND tag_id = $2`;
    
    try {
        const { rows } = await pool.query(query, [userId, tagId]);
        return rows; 
    } catch (err) {
        console.log(err);
    }
}

export default { createTag, getAllUserTags, assignTagToReview, getTagsFromReview, patchTag, deleteTag };