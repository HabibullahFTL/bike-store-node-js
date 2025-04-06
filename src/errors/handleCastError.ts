import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TErrorResponse } from '../../types';

export const handleCastError = (
  error: mongoose.Error.CastError
): TErrorResponse => {
  const stack = error?.stack || '';
  const message = `Invalid value for '${error.path}': '${error.value}'.`;
  const errorSources = [{ path: '', message }];

  return {
    success: false,
    message,
    stack,
    errorSources,
    statusCode: httpStatus.BAD_REQUEST,
  };
};
