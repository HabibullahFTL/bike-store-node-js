import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ms from 'ms';
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
    throw new Error('Invalid inputs.');
  }

  // Comparing given password with hashed password
  const isPasswordMatched = await bcrypt.compare(password, hashedPassword);

  // Throwing error if password does not match
  if (!isPasswordMatched) {
    throw new Error('Password does not match.');
  }
};
