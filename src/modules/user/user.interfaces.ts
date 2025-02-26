import { Model } from 'mongoose';
import { z } from 'zod';
import { USER_ROLES, USER_STATUS } from './user.constrants';
import { createUserValidation } from './user.validations';

export type TUserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type TUserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export type TCreateUser = z.infer<typeof createUserValidation>['body'];

export interface TUser extends Pick<TCreateUser, 'name' | 'email'> {
  _id: string;
  password?: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: string;
  role: TUserRole;
  status: TUserStatus;
  isDeleted?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface TUserModel extends Model<TUser> {
  userDataById: (id: string, shouldIncludePassword?: boolean) => TUser | null;
  isUserExists: (
    email: string,
    shouldIncludePassword?: boolean
  ) => TUser | null;
  isJWTIssuedBeforePasswordChanged: (
    passwordChangedAt: string,
    iat: number
  ) => void;
}
