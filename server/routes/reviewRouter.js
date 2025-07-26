import express from 'express';
import { assignTagToReview, getTagsFromReview, deleteTagsFromReview, getPageInformation, updatePageInformation,
         assignTrophiesToReview, getTrophiesFromReview } from "../controllers/reviewController.js"
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";


const reviewRouter = express.Router(); 

reviewRouter.use(verifyJWT);

reviewRouter.delete("/:reviewid/tags/:tagid", asyncHandler(deleteTagsFromReview));

reviewRouter.post("/:reviewid/trophies", asyncHandler(assignTrophiesToReview));
reviewRouter.get("/:reviewid/trophies", asyncHandler(getTrophiesFromReview));

reviewRouter.post("/:reviewid/tags/", asyncHandler(assignTagToReview));
reviewRouter.get("/:reviewid/tags", asyncHandler(getTagsFromReview));

reviewRouter.get("/:reviewid", asyncHandler(getPageInformation));
reviewRouter.put("/:reviewid", asyncHandler(updatePageInformation));

export default reviewRouter; 