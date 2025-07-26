import express from "express";
import { refreshToken } from "../controllers/refreshTokenController.js";
import asyncHandler from "express-async-handler";

const refreshRouter = express.Router(); 

refreshRouter.get("/", asyncHandler(refreshToken));

export default refreshRouter; 
