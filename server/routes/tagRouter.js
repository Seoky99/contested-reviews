import express from "express";
import { createTag, patchTag, deleteTag } from "../controllers/tagController.js";
import { tagCreationSchema, tagIdSchema } from "../controllers/schemas/tagSchemas.js";
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";
import validateRequest from "../middleware/validateRequest.js";

const tagRouter = express.Router(); 

tagRouter.use(verifyJWT);

tagRouter.delete("/:tagId", validateRequest({paramsSchema: tagIdSchema}), asyncHandler(deleteTag)); 

tagRouter.post("/", validateRequest({bodySchema: tagCreationSchema}), asyncHandler(createTag)); 

//tagRouter.patch("/:tagid", asyncHandler(patchTag)); 
//tagRouter.get("/", validateRequest(tagCreationSchema), asyncHandler(getAllUserTags));

export default tagRouter; 