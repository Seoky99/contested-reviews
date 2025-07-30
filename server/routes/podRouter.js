import express from "express";
import { getPodPageInformation } from "../controllers/podController.js";
import { tagCreationSchema, tagIdSchema } from "../controllers/schemas/tagSchemas.js";
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";
import validateRequest from "../middleware/validateRequest.js";

const podRouter = express.Router(); 

//podRouter.use(verifyJWT);

podRouter.get("/", asyncHandler(getPodPageInformation));

//tagRouter.delete("/:tagId", validateRequest({paramsSchema: tagIdSchema}), asyncHandler(deleteTag)); 

export default podRouter; 