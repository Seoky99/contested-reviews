import express from "express"; 
import { getSetReview, getSetReviewCardsEdit, postSetReviewCardsEdit, createSetReview, getSetReviews, getSetReviewCards, getSetReviewTags, getSetReviewTrophies, 
    putSetReviewTrophies, getCardPageInformation, patchCardFromSetReview, deleteSetReview, getSetReviewStatsColors } from "../controllers/setReviewController.js";
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";

const setReviewRouter = express.Router(); 

setReviewRouter.use(verifyJWT);

setReviewRouter.get("/:setid/stats/colors", asyncHandler(getSetReviewStatsColors));

setReviewRouter.post("/:setid/cards/edit", asyncHandler(postSetReviewCardsEdit));
setReviewRouter.get("/:setid/cards/edit", asyncHandler(getSetReviewCardsEdit));
setReviewRouter.patch("/:setid/cards/:cardid", asyncHandler(patchCardFromSetReview));
setReviewRouter.get("/:setid/cards/:cardid", asyncHandler(getCardPageInformation));

setReviewRouter.get("/:setid/tags", asyncHandler(getSetReviewTags));

setReviewRouter.put("/:setid/trophies", asyncHandler(putSetReviewTrophies));
setReviewRouter.get("/:setid/trophies", asyncHandler(getSetReviewTrophies));

setReviewRouter.get("/:setid/cards", asyncHandler(getSetReviewCards));

setReviewRouter.delete("/:setid", asyncHandler(deleteSetReview));
setReviewRouter.get("/:setid", asyncHandler(getSetReview));

setReviewRouter.post("/", asyncHandler(createSetReview));
setReviewRouter.get("/", asyncHandler(getSetReviews));

export default setReviewRouter; 