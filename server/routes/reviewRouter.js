import express from 'express';
import { assignTagToReview, getTagsFromReview, deleteTagsFromReview, updatePageInformation } from "../controllers/reviewController.js"

const reviewRouter = express.Router(); 

reviewRouter.delete("/:reviewid/tags/:tagid", deleteTagsFromReview);

reviewRouter.post("/:reviewid/tags/", assignTagToReview);
reviewRouter.get("/:reviewid/tags", getTagsFromReview);

reviewRouter.put("/:reviewid", updatePageInformation);

export default reviewRouter; 