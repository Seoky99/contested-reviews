import express from "express";
import { getAllUserTags, createTag, patchTag, deleteTag } from "../controllers/tagController.js";
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";
import { tagCreationSchema } from "../controllers/schemas/tagCreationSchema.js";
import validateRequest from "../middleware/validateRequest.js";

const tagRouter = express.Router(); 

tagRouter.use(verifyJWT);

//tagRouter.patch("/:tagid", asyncHandler(patchTag)); 
tagRouter.delete("/:tagid", asyncHandler(deleteTag)); 

tagRouter.post("/", asyncHandler(createTag)); 
tagRouter.get("/", validateRequest(tagCreationSchema), asyncHandler(getAllUserTags));

export default tagRouter; 