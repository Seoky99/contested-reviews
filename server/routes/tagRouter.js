import express from "express";
import { getAllUserTags, createTag, patchTag, deleteTag } from "../controllers/tagController.js";

const tagRouter = express.Router(); 


tagRouter.patch("/:tagid", patchTag); 
tagRouter.delete("/:tagid", deleteTag); 

tagRouter.post("/", createTag); 
tagRouter.get("/", getAllUserTags);

export default tagRouter; 