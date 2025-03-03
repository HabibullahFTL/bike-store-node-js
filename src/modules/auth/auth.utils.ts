import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ms from 'ms';
import { config } from '../../config';
import AppError from '../../errors/AppError';
import { TUser } from '../user/user.interfaces';
import { tokenExpiresIn, tokenSecret } from './auth.constrants';
import { TokenType } from './auth.interfaces';

// Generating tokens
export const generateJwtToken = (user: TUser | null, tokenType: TokenType) => {
  // Payload for token
  const tokenPayload: Pick<TUser, '_id' | 'email' | 'role'> = {
    _id: user?._id!,
    email: user?.email!,
    role: user?.role!,
  };

  return jwt.sign(tokenPayload, tokenSecret?.[tokenType], {
    expiresIn: tokenExpiresIn?.[tokenType] as ms.StringValue,
  });
};

// Verifying JWT token
export const verifyJwtToken = (token: string, tokenType: TokenType) => {
  return jwt.verify(token, tokenSecret?.[tokenType]) as JwtPayload;
};

// Check password matched or not, if not, throws an error
export const checkPasswordMatchedAndThrowError = async (
  password: string,
  hashedPassword: string
) => {
  if (!password || !hashedPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid inputs.');
  }

  // Comparing given password with hashed password
  const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

  // Throwing error if password does not match
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password does not match.');
  }
};

// Hash password
export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, config.password_salt);
  return hashedPassword;
};
