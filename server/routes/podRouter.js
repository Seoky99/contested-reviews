import express from "express";
import { createPod, getUsersForPods, getUserSetsForPods, viewPodMemberCards, viewPodMemberOverview,
         deleteUserFromPod, addUserToPod 
 } from "../controllers/podController.js";
import { podIdSchema, podUserSetIdSchema, createPodSchema } from "../controllers/schemas/podSchema.js";
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";
import validateRequest from "../middleware/validateRequest.js";

const podRouter = express.Router(); 

podRouter.use(verifyJWT);

podRouter.get("/:podId/view/:userSetId/overview", validateRequest({paramsSchema: podUserSetIdSchema}), asyncHandler(viewPodMemberOverview));
podRouter.get("/:podId/view/:userSetId/cards", validateRequest({paramsSchema: podUserSetIdSchema}), asyncHandler(viewPodMemberCards));

podRouter.post("/join", asyncHandler(addUserToPod));

podRouter.delete("/:podId", validateRequest({paramsSchema: podIdSchema}), asyncHandler(deleteUserFromPod));
podRouter.get("/:podId", validateRequest({paramsSchema: podIdSchema}), asyncHandler(getUserSetsForPods));

podRouter.post("/", validateRequest({bodySchema: createPodSchema}), asyncHandler(createPod));
podRouter.get("/", asyncHandler(getUsersForPods));

export default podRouter; 