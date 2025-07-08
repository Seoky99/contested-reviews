import express from "express"; 
import { createSetReview, getSetReviews, getSetReviewCards, getCardFromSetReview, patchCardFromSetReview, deleteSetReview } from "../controllers/setReviewController.js";

const setReviewRouter = express.Router(); 

setReviewRouter.patch("/:setid/cards/:cardid", patchCardFromSetReview);
setReviewRouter.get("/:setid/cards/:cardid", getCardFromSetReview);

setReviewRouter.get("/:setid/cards", getSetReviewCards);

setReviewRouter.delete("/:setid", deleteSetReview);

setReviewRouter.post("/", createSetReview);
setReviewRouter.get("/", getSetReviews);

export default setReviewRouter; 