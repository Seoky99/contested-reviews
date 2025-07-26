import express from "express"; 
import { getSets } from "../controllers/setsController.js";
import verifyJWT from "../middleware/verifyJWT.js";
import asyncHandler from "express-async-handler";

const setsRouter = express.Router();

setsRouter.use(verifyJWT);

setsRouter.get("/", asyncHandler(getSets));

export default setsRouter; 
