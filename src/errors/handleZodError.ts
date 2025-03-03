import httpStatus from 'http-status';
import { ZodError } from 'zod';
import { TErrorResponse } from '../../types';

export const handleZodError = (error: ZodError): TErrorResponse => {
  const stack = error?.stack || '';
  const message = 'Invalid Inputs';
  const errorSources = error?.issues?.map((item) => ({
    path: item?.path?.[item?.path?.length - 1] as string,
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
