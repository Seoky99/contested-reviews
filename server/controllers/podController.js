import db from "../models/database/podQueries.js";
import qdb from "../models/database/queries.js";
import cardsdb from "../models/database/queries.js";
import statsdb from "../models/database/statsQueries.js";
import { nanoid } from 'nanoid';
import { customAlphabet } from "nanoid"; 
import { calculateAveragesPerColor } from "./utils/calculateAveragesPerColor.js";
import groupMembersByPod from "./utils/groupMembersByPod.js";
import extractCardFromRows from "./utils/extractCardFromRows.js";
import { verifyAccessToPods, verifyAccessToPodSetReview  } from "./utils/verify.js";

async function createPod(req, res) {
    const userId = req.userId; 

    const {podName, isPrivate} = req.body; 

    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
    let podCode = nanoid(); 
    let alreadyExists = await db.podCodeExists(podCode); 

    //Attempt to generate at least five unique room codes before returning an error 
    for (let i = 0; i < 5; i++) {
        if (!alreadyExists) {
            break; 
        }
        podCode = nanoid(); 
        alreadyExists = await db.podCodeExists(podCode);  
    }

    if (alreadyExists) {
        return res.status(500).json({message: 'Could not generate unique pod code'}); 
    }

    await db.createPod(podName, podCode, isPrivate, userId);

    res.json(podCode);
}

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

async function viewPodMemberCards(req, res) {
    const userId = req.userId; 
    const { podId, userSetId } = req.params;
    
    //Verify members are in the same pod
    if (!(await verifyAccessToPodSetReview (userId, podId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this pod."})
    } 

    const rows = await cardsdb.getReviewsWithCards(userSetId);
    const cards = extractCardFromRows(rows); 

    res.json(cards);
}

async function viewPodMemberOverview(req, res) {
    const userId = req.userId; 
    const { podId, userSetId } = req.params; 

    if (!(await verifyAccessToPodSetReview (userId, podId, userSetId))) {
        return res.status(403).json({message: "Forbidden: You don't have access to this set overview."})
    }

    const [trophies, colorStats, setReviewInfo] = await Promise.all([
        qdb.getSetReviewTrophies(userSetId),
        statsdb.getRatedReviews(userSetId),
        qdb.getSetReview(userId, userSetId)
    ]);
    
    const stats = calculateAveragesPerColor(colorStats);
    const setReviewData = setReviewInfo[0]

    res.json({trophies, stats, setReviewData});
}



export { createPod, getUsersForPods, getUserSetsForPods, viewPodMemberCards, viewPodMemberOverview };