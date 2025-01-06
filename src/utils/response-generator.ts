import { IResponse } from '../../types';

export const generateResponse = <T>({
  success,
  message,
  data,
  error,
  stack,
}: IResponse<T> & { stack?: string }): IResponse<T> & { stack?: string } => {
  const isSuccess = success || false;

  return {
    success: isSuccess,
    message,
    data: isSuccess ? data : undefined, // Only include `data` in success responses
    error: isSuccess ? undefined : error || 'An unexpected error occurred', // Only include `error` in failure responses
    stack: isSuccess ? undefined : stack, // Only include `stack` in failure responses
  };
};
