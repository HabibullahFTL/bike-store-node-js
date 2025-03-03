import httpStatus from 'http-status';
import ms from 'ms';
import { config } from '../../config';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response-generator';
import { refreshTokenName } from './auth.constrants';
import AuthServices from './auth.services';

// Handles logging in user
const loginUser = catchAsync(async (req, res) => {
  // Calling login service
  const { user, refresh_token, access_token } = await AuthServices.login(
    req.body?.email,
    req.body?.password
  );

  // Setting the refresh token to cookie
  res.cookie(refreshTokenName, refresh_token, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: ms(config.jwt_refresh_token_expires_in! as ms.StringValue),
  });

  // Removing sensitive fields
  user.password = undefined;
  user.passwordChangedAt = undefined;
  user.isDeleted = undefined;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully.',
    data: { user, access_token },
  });
});

// Handles changing password
const changePassword = catchAsync(async (req, res) => {
  const modifiedUserData = await AuthServices.changePasswordIntoDB(
    req?.user?._id!,
    req?.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully.',
    data: modifiedUserData,
  });
});

// Handles generating new access token
const refreshToken = catchAsync(async (req, res) => {
  const { access_token } = await AuthServices.getAccessToken(
    req?.cookies?.[refreshTokenName]!
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Generated access token successfully.',
    data: { access_token },
  });
});

const AuthControllers = { loginUser, changePassword, refreshToken };

export default AuthControllers;
