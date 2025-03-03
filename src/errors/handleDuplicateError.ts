import httpStatus from 'http-status';
import { TErrorResponse } from '../../types';

interface TDuplicateErrorResponse {
  keyValue: { [key: string]: string };
  code: number;
  stack: string;
}
interface TDuplicateError extends TDuplicateErrorResponse {
  errorResponse: TDuplicateErrorResponse;
}

export const handleDuplicateError = (
  error: TDuplicateError
): TErrorResponse => {
  const stack = error?.stack || '';

  const duplicateKeys = Object.keys(
    error?.keyValue || error?.errorResponse?.keyValue
  );
  const duplicateKeyCount = duplicateKeys?.length || 0;
  const duplicateErrors = error?.keyValue || error?.errorResponse?.keyValue;

  // Combined message
  const message = `${
    duplicateKeyCount === 1
      ? duplicateErrors?.[duplicateKeys?.[0]] + ' is'
      : duplicateKeys?.join(', ') + ' are'
  } already exists`;

  // Error sources
  const errorSources = duplicateKeys?.map((key) => ({
    path: key,
    message: `${duplicateErrors?.[key]} is already exists`,
  }));

  return {
    success: false,
    message,
    stack,
    errorSources,
    statusCode: httpStatus.BAD_REQUEST,
  };
};
