import express from 'express';
import { assignTagToReview, getTagsFromReview, deleteTagsFromReview, getPageInformation, updatePageInformation,
         assignTrophiesToReview, getTrophiesFromReview } from "../controllers/reviewController.js"

const reviewRouter = express.Router(); 

reviewRouter.delete("/:reviewid/tags/:tagid", deleteTagsFromReview);

reviewRouter.post("/:reviewid/trophies", assignTrophiesToReview);
reviewRouter.get("/:reviewid/trophies", getTrophiesFromReview);

reviewRouter.post("/:reviewid/tags/", assignTagToReview);
reviewRouter.get("/:reviewid/tags", getTagsFromReview);

reviewRouter.get("/:reviewid", getPageInformation);
reviewRouter.put("/:reviewid", updatePageInformation);

export default reviewRouter; 