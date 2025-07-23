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

export default { checkDuplicateUser, registerUser, findUserFromUsername };