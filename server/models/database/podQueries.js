import pool from "../pool.js"; 

async function podCodeExists(podCode) {
    const query = `SELECT * FROM pods WHERE pod_code = $1`;

    try {
        const { rowCount } = await pool.query(query, [podCode]); 
        return rowCount >= 1; 
    } catch (err) {
        console.log(err); 
        throw err; 
    }
}

async function createPod(podName, podCode, isPrivate, userId) {
    const client = await pool.connect(); 
    const query = `INSERT INTO pods(pod_name, pod_code, is_private) VALUES ($1, $2, $3) RETURNING pod_id`; 
    const insertUserQuery = `INSERT INTO pod_users(pod_id, user_id, role) VALUES ($1, $2, $3)`;

    try {
        await client.query('BEGIN');
        const {rows}= await client.query(query, [podName, podCode, isPrivate]); 
        const podId = rows[0].pod_id;    
        await client.query(insertUserQuery, [podId, userId, 'Admin']);
        await client.query('COMMIT'); 
    } catch (err) {
        console.log(err); 
        await client.query('ROLLBACK');
        throw err; 
    } finally {
        client.release();
    }
}

async function getPodPageInformation(userId) {
    //Left join by user sets to get the user set information of pods the user is in, but aren't reviews for
    const query = `SELECT 
    pods.pod_id, 
    pods.pod_name, 
    user_sets.user_set_id, 
    user_sets.name AS set_name, 
    us.username,
    user_set_img, 
    includes_bonus
        FROM pods
        JOIN pod_users pu_current ON pods.pod_id = pu_current.pod_id
        JOIN pod_users pu_all ON pods.pod_id = pu_all.pod_id
        JOIN users us ON pu_all.user_id = us.user_id
        JOIN user_sets ON us.user_id = user_sets.user_id
        WHERE pu_current.user_id = $1;`

    try {
        const { rows } = await pool.query(query, [userId]);
        return rows; 
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getUserInfoForPods(userId) {
    
    const query = `SELECT username, pod_users.pod_id, pod_name, pod_code
                   FROM pod_users
                   JOIN pods ON pod_users.pod_id = pods.pod_id
                   JOIN users ON pod_users.user_id = users.user_id
                   WHERE pods.pod_id IN (
                        SELECT pod_id FROM pod_users WHERE user_id = $1
                   )`

    try {
        const { rows } = await pool.query(query, [userId]);
        return rows; 
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getUserSetsForPods(podId) {

    const query = `SELECT user_sets.user_set_id, 
                        user_sets.name AS set_name, 
                        username,
                        users.user_id, 
                        user_set_img, 
                        includes_bonus,
                        to_char(lock_time, 'FMMM/DD/YYYY, FMHH12:MIAM') AS formatted_lock_time
                    FROM pod_user_sets 
                    JOIN user_sets ON user_sets.user_set_id = pod_user_sets.user_set_id
                    JOIN users ON user_sets.user_id = users.user_id
                    WHERE pod_user_sets.pod_id = $1
                    ORDER BY lock_time DESC;` 

    try {
        const { rows } = await pool.query(query, [podId]);
        return rows; 
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function deleteUserFromPod(userId, podId) {
    const client = await pool.connect(); 

    const countQuery = `SELECT COUNT(*) FROM pod_users WHERE pod_id = $1`; 
    const query = `DELETE FROM pod_users WHERE pod_id = $2 AND user_id = $1`; 
    const deletePodQuery = `DELETE FROM pods WHERE pod_id = $1`; 

    try {
        await client.query('BEGIN'); 
        await client.query(query, [userId, podId]);

        const { rows } = await client.query(countQuery, [podId]);
        const numUsers = rows[0].count;

        if (numUsers <= 0) {
            await client.query(deletePodQuery, [podId]);
        }

        await client.query('COMMIT');  
    } catch (err) {
        console.log(err); 
        await client.query('ROLLBACK');  
        throw err; 
    } finally {
        client.release(); 
    }
}

async function addUserToPod(userId, podCode) {
    const client = await pool.connect(); 

    const extractPodID = `SELECT pod_id FROM pods WHERE pod_code = $1`;
    const query = 'INSERT INTO pod_users(user_id, pod_id) VALUES ($1, $2)';
    
    try {
        await client.query('BEGIN'); 

        const { rows } = await client.query(extractPodID, [podCode]); 
        const podId = rows[0].pod_id; 

        if (!podId) {
            throw new Error('Pod with podcode does not exist');
        }

        await client.query(query, [userId, podId]); 

        await client.query('COMMIT'); 
    } catch(err) {
        await client.query('ROLLBACK');
        throw err; 
    } finally {
        client.release(); 
    }
}

export default { podCodeExists, createPod, getPodPageInformation, getUserInfoForPods, getUserSetsForPods, deleteUserFromPod,
                 addUserToPod,
 }