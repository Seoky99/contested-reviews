import express from "express"; 
import { createSetReview, getSetReviews, getSetReviewCards } from "../controllers/setReviewController.js";

const setReviewRouter = express.Router(); 

setReviewRouter.get("/:setid/cards", getSetReviewCards);

setReviewRouter.post("/", createSetReview);
setReviewRouter.get("/", getSetReviews);

export default setReviewRouter; 