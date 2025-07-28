import express from 'express';
import { getPageInformation, updatePageInformation } from "../controllers/reviewController.js"
import { reviewIdSchema, pageInformationSchema } from '../controllers/schemas/reviewSchemas.js';
import validateRequest from "../middleware/validateRequest.js";
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";

const reviewRouter = express.Router(); 

reviewRouter.use(verifyJWT);

reviewRouter.get("/:reviewId", validateRequest({paramsSchema: reviewIdSchema}), asyncHandler(getPageInformation));
reviewRouter.put("/:reviewId", validateRequest({paramsSchema: reviewIdSchema, bodySchema: pageInformationSchema}), asyncHandler(updatePageInformation));

/*
    These routes were for originally sending a server call for each page information bit. Can open up for use later, check authentication tho 
*/

//reviewRouter.delete("/:reviewId/tags/:tagid", asyncHandler(deleteTagsFromReview));

//reviewRouter.post("/:reviewId/trophies", asyncHandler(assignTrophiesToReview));
//reviewRouter.get("/:reviewId/trophies", asyncHandler(getTrophiesFromReview));

//reviewRouter.post("/:reviewId/tags/", asyncHandler(assignTagToReview));
//reviewRouter.get("/:reviewId/tags", asyncHandler(getTagsFromReview));

export default reviewRouter; 