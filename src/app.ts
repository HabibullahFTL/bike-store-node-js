import 'dotenv/config';
import express, { Request, Response } from 'express';
import ProductsRouter from './modules/products/products.routes';
import { generateResponse } from './utils/response-generator';

// Initialize the express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Mounting the product routes to the /api/v1/products endpoint
app.use('/api/v1/products/', ProductsRouter);

// Handling route not found
app.all('*', (req: Request, res: Response) => {
  const error = new Error('Route not found');

  res.status(404).json(
    generateResponse({
      success: false,
      message: error.message,
      error: error,
      stack: error.stack,
    })
  );
});

// Export the app for use in server configuration
export default app;
