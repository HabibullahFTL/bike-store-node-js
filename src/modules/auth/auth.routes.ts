import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import AuthControllers from './auth.controllers';
import { loginValidationSchema } from './auth.validations';

const AuthRouter = Router();

AuthRouter.post(
  '/login',
  validateRequest(loginValidationSchema),
  AuthControllers.loginUser
);

export default AuthRouter;
