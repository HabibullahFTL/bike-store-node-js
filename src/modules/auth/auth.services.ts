import httpStatus from 'http-status';
import { z } from 'zod';
import AppError from '../../errors/appError';
import UserModel from '../user/user.model';
import {
  checkPasswordMatchedAndThrowError,
  generateJwtToken,
  hashPassword,
  verifyJwtToken,
} from './auth.utils';
import { changePasswordValidationSchema } from './auth.validations';

const login = async (email: string, password: string) => {
  // Retrieving user data based on email
  const user = await UserModel.isUserExists(email, true);

  // Checking user found or not and deleted or not
  if (!user || (user && user?.isDeleted)) {
    throw new AppError(
      user?.isDeleted ? httpStatus.BAD_REQUEST : httpStatus.NOT_FOUND,
      user?.isDeleted ? 'Your account is deleted.' : 'No user found.'
    );
  }

  // Throwing error if password does not match
  await checkPasswordMatchedAndThrowError(password, user?.password!);

  // Throwing error if user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Your account is blocked.');
  }

  // Generating tokens
  const access_token = generateJwtToken(user, 'access');
  const refresh_token = generateJwtToken(user, 'refresh');

  return { access_token, refresh_token, user };
};

const changePasswordIntoDB = async (
  userId: string,
  passwords: z.infer<typeof changePasswordValidationSchema>['body']
) => {
  const user = await UserModel.userDataById(userId, true);

  // Checking user found or not and deleted or not
  if (!user || (user && user?.isDeleted)) {
    throw new AppError(
      user?.isDeleted ? httpStatus.BAD_REQUEST : httpStatus.NOT_FOUND,
      user?.isDeleted ? 'Your account is deleted.' : 'No user found.'
    );
  }

  // Throwing error if password does not match
  await checkPasswordMatchedAndThrowError(
    passwords?.oldPassword,
    user?.password!
  );

  // Throwing error if user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Your account is blocked.');
  }

  // Hashing new password
  const newHashedPassword = await hashPassword(passwords.newPassword);

  const modifiedUserData = await UserModel.findByIdAndUpdate(user?._id, {
    password: newHashedPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date().toISOString(),
  });

  return modifiedUserData;
};

const getAccessToken = async (refreshToken: string) => {
  // Verifying refresh token
  const verifiedTokenPayload = verifyJwtToken(refreshToken, 'refresh');

  // Retrieving user data based on email
  const user = await UserModel.userDataById(verifiedTokenPayload._id);

  // Checking user found or not
  if (!user || (user && user?.isDeleted)) {
    throw new AppError(
      user?.isDeleted ? httpStatus.BAD_REQUEST : httpStatus.NOT_FOUND,
      user?.isDeleted ? 'Your account is deleted.' : 'No user found.'
    );
  }

  // Throwing error if user is blocked
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Your account is blocked.');
  }

  // It will throw an error if the token is issued before password changed
  UserModel.isJWTIssuedBeforePasswordChanged(
    user?.passwordChangedAt!,
    verifiedTokenPayload.iat!
  );

  // Generating access token
  const access_token = generateJwtToken(user, 'access');

  return { access_token };
};

const AuthServices = { login, changePasswordIntoDB, getAccessToken };
export default AuthServices;
