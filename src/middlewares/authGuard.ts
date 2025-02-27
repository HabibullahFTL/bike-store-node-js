import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../errors/appError';
import { verifyJwtToken } from '../modules/auth/auth.utils';
import { TUserRole } from '../modules/user/user.interfaces';
import UserModel from '../modules/user/user.model';
import { catchAsync } from '../utils/catchAsync';

const authGuard = (...userRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Extracting access token
    const access_token = req?.headers?.authorization?.split('Bearer ')?.[1];

    if (!access_token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized.');
    }

    // Verifying access token
    const verifiedTokenPayload = verifyJwtToken(access_token!, 'access');

    if (!verifiedTokenPayload?.email || !verifiedTokenPayload?._id) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized.');
    }

    // Checking user found or not
    const user = await UserModel.userDataById(verifiedTokenPayload?._id);

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

    // Checking role
    if (userRoles && !userRoles?.includes(user?.role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are unauthorized.');
    }

    // Formatting user data for including with request data
    const formattedUser = {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
      status: user?.status,
    };
    req.user = formattedUser;
    next();
  });
};

export default authGuard;
