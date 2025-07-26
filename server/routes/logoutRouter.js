import express from "express";
import { logoutUser } from "../controllers/logoutController.js";
import asyncHandler from "express-async-handler";

const logoutRouter = express.Router(); 

logoutRouter.get("/", asyncHandler(logoutUser));

export default logoutRouter; 
