import 'dotenv/config';
import express from 'express';
import ProductsRouter from './modules/products/products.routes';

// Initialize the express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Mounting the product routes to the /api/v1/products endpoint
app.use('/api/v1/products/', ProductsRouter);

// Export the app for use in server configuration
export default app;
