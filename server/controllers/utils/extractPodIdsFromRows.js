export default function extractPodIdsFromRows(rows) {

    const podMap = new Map(); 

    rows.forEach(row => {

        const userSetId = row.user_set_id; 
        const podId = row.pod_id; 

        if (!podMap.get(userSetId)) {

            const newRow = {...row, pod_ids: []}; 
            delete newRow.pod_id;
            podMap.set(userSetId, newRow);
        }

        if (podId !== null) {
            podMap.get(userSetId).pod_ids.push(podId); 
        }

    })

    return Array.from(podMap.values());
}