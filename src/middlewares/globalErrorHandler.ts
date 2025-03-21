import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import { ZodError } from 'zod';
import AppError from '../errors/AppError';
import { handleCastError } from '../errors/handleCastError';
import { handleDuplicateError } from '../errors/handleDuplicateError';
import { handleValidationError } from '../errors/handleValidationError';
import { handleZodError } from '../errors/handleZodError';
import { sendResponse } from '../utils/response-generator';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode: number = httpStatus.BAD_REQUEST;
  let message = error?.message || 'An unexpected error occurred';
  let stack = error?.stack || '';
  let errorSources = [{ path: '', message }];

  if (error?.name === 'TokenExpiredError') {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.UNAUTHORIZED,
      message,
      stack,
      errorSources,
    });
  }
  // For AppError
  else if (error instanceof AppError) {
    statusCode = error?.statusCode || statusCode;
    errorSources = [{ path: '', message }];

    sendResponse(res, {
      success: false,
      statusCode,
      message,
      stack,
      errorSources,
    });
  }
  // Zod validation error
  else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);

    sendResponse(res, simplifiedError);
  }
  // Mongoose Validation error
  else if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);

    sendResponse(res, simplifiedError);
  }
  // Mongoose Cast error
  else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);

    sendResponse(res, simplifiedError);
  }
  // Duplicate key error
  else if (error?.code === 11000) {
    const simplifiedError = handleDuplicateError(error);

    sendResponse(res, simplifiedError);
  }
  // For other unexpected error
  else {
    sendResponse(res, {
      success: false,
      statusCode,
      message,
      stack,
      errorSources,
    });
  }
};

export default globalErrorHandler;
