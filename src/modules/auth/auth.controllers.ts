import { RequestHandler } from 'express';
import ms from 'ms';
import { config } from '../../config';
import { catchAsync } from '../../utils/catchAsync';
import { generateResponse } from '../../utils/response-generator';
import UserModel from '../user/user.model';
import {
  checkPasswordMatchedAndThrowError,
  generateJwtToken,
} from './auth.utils';

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  // Retrieving user data based on email
  const user = await UserModel.isUserExists(req.body.email, true);

  // Checking user found or not
  if (!user || (user && user?.isDeleted)) {
    throw new Error('No user found.');
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
  res.cookie('refresh_token', refresh_token, {
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

const AuthControllers = { loginUser };

export default AuthControllers;
