import { Router } from 'express';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { USER_ROLES } from '../user/user.constrants';
import AuthControllers from './auth.controllers';
import {
  changePasswordValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
} from './auth.validations';

const AuthRouter = Router();

// For login
AuthRouter.post(
  '/login',
  validateRequest(loginValidationSchema),
  AuthControllers.loginUser
);

// For change password
AuthRouter.post(
  '/change-password',
  validateRequest(changePasswordValidationSchema),
  auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER),
  AuthControllers.changePassword
);

// For refresh token
AuthRouter.post(
  '/refresh-token',
  validateRequest(refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

export default AuthRouter;
