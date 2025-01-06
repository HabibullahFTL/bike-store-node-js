/**
 * Generic response structure for API responses.
 * Can be used for both success and error scenarios.
 *
 * - `success`: Indicates if the operation was successful.
 * - `code`: HTTP status code or application-specific success/error code.
 * - `message`: A brief explanation of the response.
 * - `data`: The response payload for successful operations.
 * - `error`: Error details for failure responses.
 * - `stack`: Stack trace for debugging purposes in failure responses.
 */
export interface IResponse<T = undefined> {
  success: boolean;
  code?: IErrorCode | ISuccessCode;
  message: string;
  data?: T;
  error?: string | object | array;
  stack?: string;
}
