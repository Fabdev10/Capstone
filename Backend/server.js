import express from 'express';
import mongoose from 'mongoose';
import "dotenv/config";
import userRouter from '../Backend/routes/user.Routes.js';
import authRouter from './routes/authRoutes.js';
import listingRouter from './routes/listingRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});



app.use(
  cors({
    origin: 'http://localhost:3000',  
    methods: ['GET', 'POST'],
    credentials: true,  
  })
);
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


app.listen(3001, () => {
  console.log('Server is running on port 3001...');
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({ success: false, statusCode, message });
});
