import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TErrorResponse } from '../../types';

export const handleValidationError = (
  error: mongoose.Error.ValidationError
): TErrorResponse => {
  const stack = error?.stack || '';
  const message = 'Validation error';
  const errorSources = Object.values(error.errors)?.map((item) => ({
    path: item?.path,
    message: item?.message as string,
  }));

  return {
    success: false,
    message,
    stack,
    errorSources,
    statusCode: httpStatus.BAD_REQUEST,
  };
};
