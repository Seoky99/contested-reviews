import express from "express";
import { loginUser } from "../controllers/authController.js";
import asyncHandler from "express-async-handler";

const authRouter = express.Router(); 

authRouter.post("/", asyncHandler(loginUser));

export default authRouter; 
