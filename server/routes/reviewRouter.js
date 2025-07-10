import express from 'express';
import { getAllUserTags } from "../controllers/reviewController.js"

const reviewRouter = express.Router(); 

reviewRouter.get("/tags", getAllUserTags); 


export default reviewRouter; 