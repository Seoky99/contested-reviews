import 'dotenv/config';
import express from 'express';

import setReviewRouter from "./routes/setReviewRouter.js";

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));


app.use('/api/setreviews', setReviewRouter);
app.get('/', (req, res) => res.send('hallo'));

app.listen('8080', () => {
  console.log('Server running!');
});
