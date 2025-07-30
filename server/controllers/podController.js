import db from "../models/database/podQueries.js";
import groupUserSetsByPodId from "./utils/groupUserSetsByPodId.js";
import { verifyAccessToUserSet, verifyAccessToTag } from "./utils/verify.js";

async function getPodPageInformation(req, res) {
    const userId = req.userId; 

    //what kind of verifications might be necessary?
    /*if (!(await verifyAccessToUserSet(userId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this user set."})
    } */

    const rows = await db.getPodPageInformation(userId);

    const rowsGroupedByPodId =  groupUserSetsByPodId(rows);

    res.json(rowsGroupedByPodId);
}


export { getPodPageInformation };