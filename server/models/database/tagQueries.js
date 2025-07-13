import pool from "../pool.js"; 
import queryGenerator from "../config/queryGenerator.js";

async function createTag(userId, setId, tagName) {
    const query = `INSERT INTO tags (user_id, set_id, name) VALUES ($1, $2, $3)
                    RETURNING tag_id`;

    try {
        const {rows} = await pool.query(query, [userId, setId, tagName]);
        return rows;
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

async function assignTagToReview(reviewId, tagIds) {
    const initialQuery = `INSERT INTO review_tags(review_id, tag_id) VALUES `;

    const query = `${queryGenerator(initialQuery, tagIds.length, 2)} ON CONFLICT DO NOTHING RETURNING review_id, tag_id`;
    console.log(tagIds);
    let dataArray = [];

    tagIds.forEach(tagId => dataArray.push(reviewId, tagId));

    console.log(query);
    console.log(dataArray);

    try {
        const { rows } = await pool.query(query, dataArray);
        console.log(rows);
        return rows; 
    } catch (err) {
        console.log(err);
    } 
}

async function deleteTagsFromReview(reviewId, tagId) {
    const query = `DELETE FROM review_tags WHERE review_id = $1 AND tag_id = $2`;

    try {
        await pool.query(query, [reviewId, tagId]);
    } catch (err) {
        console.log(err);
    }
}

async function getTagsFromReview(userId, reviewId) {
    const query = `SELECT * FROM review_tags 
                    JOIN tags ON tags.tag_id = review_tags.tag_id 
                    WHERE user_id = $1 AND review_id = $2`;

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

export default { createTag, getAllUserTags, assignTagToReview, getTagsFromReview, deleteTagsFromReview, patchTag, deleteTag };