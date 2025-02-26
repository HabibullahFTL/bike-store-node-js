import { NextFunction, Request, Response } from 'express';
import { TUserRole } from '../modules/user/user.interfaces';

const auth = (...userRoles: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log({ userRoles });
    next();
  };
};

export default auth;
