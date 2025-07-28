import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import reviewRouter from './routes/reviewRouter.js';
import setReviewRouter from './routes/setReviewRouter.js';
import setsRouter from "./routes/setsRouter.js";
import tagRouter from "./routes/tagRouter.js";
import registerRouter from './routes/registerRouter.js';
import authRouter from './routes/authRouter.js';
import refreshRouter from './routes/refreshRouter.js';
import logoutRouter from './routes/logoutRouter.js';

const app = express();

const corsOptions = {
  origin: ['https://contested-reviews.vercel.app'],
  //origin: ['http://localhost:5173'],
  credentials: true
}

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(limiter);
app.use(helmet());

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

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log('Server running!');
});
