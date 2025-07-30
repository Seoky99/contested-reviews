import db from "../models/database/podQueries.js";
import groupMembersByPod from "./utils/groupMembersByPod.js";
import { verifyAccessToPods  } from "./utils/verify.js";

async function getUsersForPods(req, res) {
    const userId = req.userId; 

    const rows = await db.getUserInfoForPods(userId);
    const rowsGroupedByPodId = groupMembersByPod(rows);

    res.json(rowsGroupedByPodId);
}

async function getUserSetsForPods(req, res) {
    const userId = req.userId; 
    const { podId } = req.params; 

    if (!(await verifyAccessToPods(userId, [podId]))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this pod."})
    } 

    const rows = await db.getUserSetsForPods(podId);

    res.json(rows);
}




export { getUsersForPods, getUserSetsForPods };