import ms from 'ms';
import { config } from '../../config';
import { catchAsync } from '../../utils/catchAsync';
import { generateResponse } from '../../utils/response-generator';
import UserModel from '../user/user.model';
import { refreshTokenName } from './auth.constrants';
import {
  checkPasswordMatchedAndThrowError,
  generateJwtToken,
  verifyJwtToken,
} from './auth.utils';

// Handles logging in user
const loginUser = catchAsync(async (req, res) => {
  // Retrieving user data based on email
  const user = await UserModel.isUserExists(req.body.email, true);

  // Checking user found or not and deleted or not
  if (!user || (user && user?.isDeleted)) {
    throw new Error(
      user?.isDeleted ? 'Your account is deleted.' : 'No user found.'
    );
  }

  // Throwing error if password does not match
  await checkPasswordMatchedAndThrowError(req.body.password, user?.password!);

  // Throwing error if user is blocked
  if (user?.status === 'blocked') {
    throw new Error('Your account is blocked.');
  }

  // Generating tokens
  const access_token = generateJwtToken(user, 'access');
  const refresh_token = generateJwtToken(user, 'refresh');

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

  res.json(
    generateResponse({
      success: true,
      message: 'Logged in successfully.',
      data: { user, access_token },
    })
  );
});

// Handles changing password
const changePassword = catchAsync(async (req, res) => {
  console.log({ data: req.body });

  res.json({
    message: 'Password changed',
  });
});

// Handles generating new access token
const refreshToken = catchAsync(async (req, res) => {
  // Verifying refresh token
  const verifiedTokenPayload = verifyJwtToken(
    req?.cookies?.[refreshTokenName]!,
    'refresh'
  );

  // Retrieving user data based on email
  const user = await UserModel.userDataById(verifiedTokenPayload._id);

  // Checking user found or not
  if (!user || (user && user?.isDeleted)) {
    throw new Error(
      user?.isDeleted ? 'Your account is deleted.' : 'No user found.'
    );
  }

  // Throwing error if user is blocked
  if (user?.status === 'blocked') {
    throw new Error('Your account is blocked.');
  }

  // It will throw an error if the token is issued before password changed
  UserModel.isJWTIssuedBeforePasswordChanged(
    user?.passwordChangedAt!,
    verifiedTokenPayload.iat!
  );

  // Generating access token
  const access_token = generateJwtToken(user, 'access');

  res.json(
    generateResponse({
      success: true,
      message: 'Generated access token successfully.',
      data: { access_token },
    })
  );
});

const AuthControllers = { loginUser, changePassword, refreshToken };

export default AuthControllers;
