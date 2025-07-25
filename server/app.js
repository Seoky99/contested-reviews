import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import reviewRouter from './routes/reviewRouter.js';
import setReviewRouter from './routes/setReviewRouter.js';
import setsRouter from "./routes/setsRouter.js";
import tagRouter from "./routes/tagRouter.js";
import registerRouter from './routes/registerRouter.js';
import authRouter from './routes/authRouter.js';
import cookieParser from "cookie-parser";
import refreshRouter from './routes/refreshRouter.js';
import logoutRouter from './routes/logoutRouter.js';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
}

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/register', registerRouter);
app.use('/api/auth', authRouter);
app.use('/api/refresh', refreshRouter);
app.use("/api/logout", logoutRouter)

//If developing pages below for non-logged-in viewing, use per-router
app.use('/api/tags', tagRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/setreviews', setReviewRouter);
app.use('/api/sets', setsRouter);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen('8080', () => {
  console.log('Server running!');
});
