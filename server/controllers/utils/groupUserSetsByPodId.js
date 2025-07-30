export default function groupUserSetsByPodId(rows) {

    const podMap = new Map();

    rows.forEach( row => {

        const podId = row.pod_id; 

        if (!podMap.get(podId)) {

            const podParent = {podId: podId, podName: row.pod_name, userSets: []}; 
            podMap.set(podId, podParent);
        }

        const userSet = {setName: row.set_name, userSetId: row.user_set_id, username: row.username,
                         userSetImg: row.user_set_img, includesBonus: row.includes_bonus};
        podMap.get(podId).userSets.push(userSet); 
    });

    return Array.from(podMap.values());

}