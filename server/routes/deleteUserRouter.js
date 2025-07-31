import express from "express";
import { deleteUser } from "../controllers/deleteUserController.js";
import asyncHandler from "express-async-handler";
import verifyJWT from "../middleware/verifyJWT.js";

const deleteUserRouter = express.Router(); 

deleteUserRouter.use(verifyJWT);

deleteUserRouter.delete("/", asyncHandler(deleteUser));

export default deleteUserRouter; 
