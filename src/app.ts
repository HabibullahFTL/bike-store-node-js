import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from './errors/appError';
import globalErrorHandler from './middlewares/globalErrorHandler';
import APIRouter from './routes';
import { generateResponse } from './utils/response-generator';

// Initialize the express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(
  cors({
    origin: ['http://localhost:5173'],
  })
);
app.use(express.json());
app.use(cookieParser());

// Mounting the routes
app.use('/api', APIRouter);

// Handling route not found
app.all('*', (req: Request, res: Response) => {
  const error = new AppError(httpStatus.NOT_FOUND, 'Route not found');

  res.status(404).json(
    generateResponse({
      success: false,
      message: error.message,
      error: error,
      stack: error.stack,
    })
  );
});

// Handling error in global error handler
app.use(globalErrorHandler);

// Export the app for use in server configuration
export default app;
