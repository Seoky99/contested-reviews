import express from "express";
import { loginUser } from "../controllers/authController.js";
import { loginSchema } from "../controllers/schemas/authSchemas.js";
import asyncHandler from "express-async-handler";
import validateRequest from "../middleware/validateRequest.js";

const authRouter = express.Router(); 

authRouter.post("/", validateRequest({bodySchema: loginSchema}), asyncHandler(loginUser));

export default authRouter; 
