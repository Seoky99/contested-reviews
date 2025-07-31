import pool from "../pool.js"; 

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
    
    const query = `SELECT username, pod_users.pod_id, pod_name
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

export default { getPodPageInformation, getUserInfoForPods, getUserSetsForPods }