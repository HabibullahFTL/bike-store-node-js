import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { config } from '../../config';
import { TUser } from '../user/user.interfaces';

// Generating tokens
export const generateJwtToken = (
  user: TUser | null,
  tokenType: 'access' | 'refresh'
) => {
  // Payload for token
  const tokenPayload: Pick<TUser, '_id' | 'email' | 'role'> = {
    _id: user?._id!,
    email: user?.email!,
    role: user?.role!,
  };

  // Secrets based on token type
  const secret = {
    access: config.jwt_access_token_secret!,
    refresh: config.jwt_refresh_token_secret!,
  };

  // ExpiresIns based on token type
  const expiresIn = {
    access: config.jwt_access_token_expires_in!,
    refresh: config.jwt_refresh_token_expires_in!,
  };

  return jwt.sign(tokenPayload, secret?.[tokenType], {
    expiresIn: expiresIn?.[tokenType] as ms.StringValue,
  });
};

// Check password matched or not, if not, throws an error
export const checkPasswordMatchedAndThrowError = async (
  password: string,
  hashedPassword: string
) => {
  if (!password || !hashedPassword) {
    throw new Error('Invalid inputs.');
  }

  // Comparing given password with hashed password
  const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

  // Throwing error if password does not match
  if (!isPasswordMatched) {
    throw new Error('Password does not match.');
  }
};
