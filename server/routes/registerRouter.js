import express from "express";
import { registerUser } from "../controllers/registerController.js"; 
import asyncHandler from "express-async-handler";

const registerRouter = express.Router(); 

registerRouter.post("/", asyncHandler(registerUser));

export default registerRouter; 
