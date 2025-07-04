import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import setReviewRouter from './routes/setReviewRouter.js';
import setsRouter from "./routes/setsRouter.js";

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));



app.use('/api/setreviews', setReviewRouter);
app.use('/api/sets', setsRouter);
app.get('/', (req, res) => res.send('hallo'));

app.listen('8080', () => {
  console.log('Server running!');
});
