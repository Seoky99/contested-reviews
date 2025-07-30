import express from "express";
import { getUsersForPods, getUserSetsForPods } from "../controllers/podController.js";
import { tagCreationSchema, tagIdSchema } from "../controllers/schemas/tagSchemas.js";
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";
import validateRequest from "../middleware/validateRequest.js";

const podRouter = express.Router(); 

podRouter.use(verifyJWT);

podRouter.get("/:podId", asyncHandler(getUserSetsForPods));

podRouter.get("/", asyncHandler(getUsersForPods));

//tagRouter.delete("/:tagId", validateRequest({paramsSchema: tagIdSchema}), asyncHandler(deleteTag)); 

export default podRouter; 