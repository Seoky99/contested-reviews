import express from "express"; 
import { getSets } from "../controllers/setsController.js";

const setsRouter = express.Router();

setsRouter.get("/", getSets);

export default setsRouter; 
