import { Router } from 'express';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { USER_ROLES } from './user.constrants';
import UserControllers from './user.controllers';
import { createUserValidation } from './user.validations';

const UserRouter = Router();

// For create a new admin
UserRouter.post(
  '/create-admin',
  auth(USER_ROLES.ADMIN),
  validateRequest(createUserValidation),
  UserControllers.createAdmin
);

// For customer registration
UserRouter.post('/customer-registration', UserControllers.customerRegistration);

// For retrieving all the users
UserRouter.get('/', UserControllers.getAllUsers);

export default UserRouter;
