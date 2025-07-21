import express from "express"; 
import { getSetReviewCardsEdit, postSetReviewCardsEdit, createSetReview, getSetReviews, getSetReviewCards, getSetReviewTags, getSetReviewTrophies, 
    putSetReviewTrophies, getCardPageInformation, patchCardFromSetReview, deleteSetReview, getSetReviewStatsColors } from "../controllers/setReviewController.js";

const setReviewRouter = express.Router(); 


setReviewRouter.get("/:setid/stats/colors", getSetReviewStatsColors);

setReviewRouter.post("/:setid/cards/edit", postSetReviewCardsEdit);
setReviewRouter.get("/:setid/cards/edit", getSetReviewCardsEdit);
setReviewRouter.patch("/:setid/cards/:cardid", patchCardFromSetReview);
setReviewRouter.get("/:setid/cards/:cardid", getCardPageInformation);

setReviewRouter.get("/:setid/tags", getSetReviewTags);

setReviewRouter.put("/:setid/trophies", putSetReviewTrophies);
setReviewRouter.get("/:setid/trophies", getSetReviewTrophies);

setReviewRouter.get("/:setid/cards", getSetReviewCards);

setReviewRouter.delete("/:setid", deleteSetReview);

setReviewRouter.post("/", createSetReview);
setReviewRouter.get("/", getSetReviews);

export default setReviewRouter; 