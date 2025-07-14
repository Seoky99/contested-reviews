import express from "express"; 
import { createSetReview, getSetReviews, getSetReviewCards, getSetReviewTrophies, putSetReviewTrophies, getCardPageInformation, patchCardFromSetReview, deleteSetReview } from "../controllers/setReviewController.js";

const setReviewRouter = express.Router(); 

setReviewRouter.patch("/:setid/cards/:cardid", patchCardFromSetReview);
setReviewRouter.get("/:setid/cards/:cardid", getCardPageInformation);

setReviewRouter.put("/:setid/trophies", putSetReviewTrophies);
setReviewRouter.get("/:setid/trophies", getSetReviewTrophies);

setReviewRouter.get("/:setid/cards", getSetReviewCards);

setReviewRouter.delete("/:setid", deleteSetReview);

setReviewRouter.post("/", createSetReview);
setReviewRouter.get("/", getSetReviews);

export default setReviewRouter; 