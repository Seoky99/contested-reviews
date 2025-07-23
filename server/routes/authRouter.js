import express from "express";
import { loginUser } from "../controllers/authController.js";

const authRouter = express.Router(); 

authRouter.post("/", loginUser);

export default authRouter; 
