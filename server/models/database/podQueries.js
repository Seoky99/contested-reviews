import pool from "../pool.js"; 

async function getPodPageInformation(userId) {

    //Left join by user sets to get the user set information of pods the user is in, but aren't reviews for

    const query = `SELECT pods.pod_id, pods.pod_name, user_sets.user_set_id, user_sets.name AS set_name, 
                          users.username, user_set_img, includes_bonus 
                   FROM users
                   JOIN pod_users ON users.user_id = pod_users.user_id
                   JOIN pods ON pod_users.pod_id = pods.pod_id
                   LEFT JOIN pod_user_sets ON pods.pod_id = pod_user_sets.pod_id
                   LEFT JOIN user_sets ON pod_user_sets.user_set_id = user_sets.user_set_id
                   WHERE users.user_id = $1;`;
    try {
        const { rows } = await pool.query(query, [userId]);
        return rows; 
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export default { getPodPageInformation }