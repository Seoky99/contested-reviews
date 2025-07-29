import express from "express"; 
import { getSetReview, getSetReviewCardsEdit, postSetReviewCardsEdit, createSetReview, getSetReviews, getSetReviewCards, getSetReviewTrophies, 
         deleteSetReview, getSetReviewStatsColors } from "../controllers/setReviewController.js";
import { setReviewSchema, userSetIdSchema } from "../controllers/schemas/setReviewSchemas.js";
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";
import validateRequest from "../middleware/validateRequest.js";

const setReviewRouter = express.Router(); 

setReviewRouter.use(verifyJWT);

setReviewRouter.get("/:userSetId/stats/colors",validateRequest({paramsSchema: userSetIdSchema}), asyncHandler(getSetReviewStatsColors));

setReviewRouter.post("/:userSetId/cards/edit", validateRequest({paramsSchema: userSetIdSchema}), asyncHandler(postSetReviewCardsEdit));
setReviewRouter.get("/:userSetId/cards/edit", validateRequest({paramsSchema: userSetIdSchema}), asyncHandler(getSetReviewCardsEdit));

setReviewRouter.get("/:userSetId/trophies", validateRequest({paramsSchema: userSetIdSchema}), asyncHandler(getSetReviewTrophies));

setReviewRouter.get("/:userSetId/cards", validateRequest({paramsSchema: userSetIdSchema}), asyncHandler(getSetReviewCards));

setReviewRouter.delete("/:userSetId", validateRequest({paramsSchema: userSetIdSchema}), asyncHandler(deleteSetReview));
setReviewRouter.get("/:userSetId", validateRequest({paramsSchema: userSetIdSchema}), asyncHandler(getSetReview));

setReviewRouter.post("/", validateRequest({bodySchema: setReviewSchema}), asyncHandler(createSetReview));
setReviewRouter.get("/", asyncHandler(getSetReviews));

//setReviewRouter.patch("/:userSetId/cards/:cardid", asyncHandler(patchCardFromSetReview));
//setReviewRouter.get("/:userSetId/cards/:cardid", asyncHandler(getCardPageInformation));

//setReviewRouter.get("/:userSetId/tags", asyncHandler(getSetReviewTags));

//setReviewRouter.put("/:userSetId/trophies", asyncHandler(putSetReviewTrophies)); 

export default setReviewRouter; 