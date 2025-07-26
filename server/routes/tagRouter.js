import express from "express";
import { getAllUserTags, createTag, patchTag, deleteTag } from "../controllers/tagController.js";
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";

const tagRouter = express.Router(); 

tagRouter.use(verifyJWT);

tagRouter.patch("/:tagid", asyncHandler(patchTag)); 
tagRouter.delete("/:tagid", asyncHandler(deleteTag)); 

tagRouter.post("/", asyncHandler(createTag)); 
tagRouter.get("/", asyncHandler(getAllUserTags));

export default tagRouter; 