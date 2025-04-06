import { Router } from 'express';
import authGuard from '../../middlewares/authGuard';
import { validateRequest } from '../../middlewares/validateRequest';
import { USER_ROLES } from './user.constrants';
import UserControllers from './user.controllers';
import {
  changeRoleValidationSchema,
  createUserValidation,
} from './user.validations';

const UserRouter = Router();

// For retrieving all the users
UserRouter.get('/', authGuard(USER_ROLES.ADMIN), UserControllers.getAllUsers);

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

// For blocking a user
UserRouter.patch(
  '/block-user/:userId',
  authGuard(USER_ROLES.ADMIN),
  UserControllers.blockUser
);

// For unblocking a user
UserRouter.patch(
  '/unblock-user/:userId',
  authGuard(USER_ROLES.ADMIN),
  UserControllers.unblockUser
);

// For changing role of a user
UserRouter.patch(
  '/change-role/:userId',
  authGuard(USER_ROLES.ADMIN),
  validateRequest(changeRoleValidationSchema),
  UserControllers.changeRole
);

export default UserRouter;
