import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from './errors/AppError';
import globalErrorHandler from './middlewares/globalErrorHandler';
import APIRouter from './routes';

// Initialize the express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Mounting the routes
app.use('/api', APIRouter);

// Handling route not found
app.all('*', (req: Request, res: Response) => {
  throw new AppError(httpStatus.NOT_FOUND, 'Route not found');
});

// Handling error in global error handler
app.use(globalErrorHandler);

// Export the app for use in server configuration
export default app;
