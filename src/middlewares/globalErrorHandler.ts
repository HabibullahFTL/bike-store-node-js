import { ErrorRequestHandler } from 'express';
import { generateResponse } from '../utils/response-generator';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.json(
    generateResponse({
      success: false,
      message: error?.message || 'Got an error',
      error,
    })
  );
};

export default globalErrorHandler;
