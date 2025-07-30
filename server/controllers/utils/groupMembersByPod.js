export default function groupMembersByPod(rows) {
    const podMap = new Map();

    rows.forEach(row => {
        const { pod_id, pod_name, username } = row;

        if (!podMap.has(pod_id)) {
            podMap.set(pod_id, {
                podId: pod_id,
                podName: pod_name,
                members: []
            });
        }

        podMap.get(pod_id).members.push({
            username
        });
    });

    return Array.from(podMap.values());
}