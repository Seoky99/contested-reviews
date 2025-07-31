import express from "express";
import { getUsersForPods, getUserSetsForPods, viewPodMemberCards, viewPodMemberOverview } from "../controllers/podController.js";
import { podIdSchema, podUserSetIdSchema } from "../controllers/schemas/podSchema.js";
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";
import validateRequest from "../middleware/validateRequest.js";

const podRouter = express.Router(); 

podRouter.use(verifyJWT);

podRouter.get("/:podId/view/:userSetId/overview", validateRequest({paramsSchema: podUserSetIdSchema}), asyncHandler(viewPodMemberOverview));
podRouter.get("/:podId/view/:userSetId/cards", validateRequest({paramsSchema: podUserSetIdSchema}), asyncHandler(viewPodMemberCards));

podRouter.get("/:podId", validateRequest({paramsSchema: podIdSchema}), asyncHandler(getUserSetsForPods));

podRouter.get("/", asyncHandler(getUsersForPods));

export default podRouter; 