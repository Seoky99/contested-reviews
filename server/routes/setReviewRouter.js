import express from "express"; 
import { createSetReview, getSetReviews } from "../controllers/setReviewController.js";

const setReviewRouter = express.Router(); 

setReviewRouter.post("/create", createSetReview);
setReviewRouter.get("/", getSetReviews);

export default setReviewRouter; 