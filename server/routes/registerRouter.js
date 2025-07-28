import express from "express";
import { registerUser } from "../controllers/registerController.js"; 
import asyncHandler from "express-async-handler";
import validateRequest from "../middleware/validateRequest.js";
import { registerSchema } from "../controllers/schemas/authSchemas.js";

const registerRouter = express.Router(); 

registerRouter.post("/", validateRequest({bodySchema: registerSchema}), asyncHandler(registerUser));

export default registerRouter; 
