import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import reviewRouter from './routes/reviewRouter.js';
import setReviewRouter from './routes/setReviewRouter.js';
import setsRouter from "./routes/setsRouter.js";
import tagRouter from "./routes/tagRouter.js";
import trophyRouter from "./routes/trophyRouter.js";

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

app.use('/api/trophies', trophyRouter); 
app.use('/api/tags', tagRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/setreviews', setReviewRouter);
app.use('/api/sets', setsRouter);
app.get('/', (req, res) => res.send('TODO: Implement'));

app.listen('8080', () => {
  console.log('Server running!');
});
