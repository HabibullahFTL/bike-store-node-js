import { Router } from 'express';
import authGuard from '../../middlewares/authGuard';
import { validateRequest } from '../../middlewares/validateRequest';
import { USER_ROLES } from './user.constrants';
import UserControllers from './user.controllers';
import { createUserValidation } from './user.validations';

const UserRouter = Router();

// For create a new admin
UserRouter.post(
  '/create-admin',
  authGuard(USER_ROLES.ADMIN),
  validateRequest(createUserValidation),
  UserControllers.createAdmin
);

// For customer registration
UserRouter.post(
  '/customer-registration',
  validateRequest(createUserValidation),
  UserControllers.customerRegistration
);

// For retrieving all the users
UserRouter.get('/', authGuard(USER_ROLES.ADMIN), UserControllers.getAllUsers);

export default UserRouter;
