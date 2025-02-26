import { Router } from 'express';
import AuthControllers from './auth.controllers';

const AuthRouter = Router();

AuthRouter.post('/login', AuthControllers.login);

export default AuthRouter;
