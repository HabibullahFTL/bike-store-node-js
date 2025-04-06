import { z } from 'zod';
import {
  emailValidationSchema,
  passwordValidationSchema,
} from '../auth/auth.validations';
import { USER_ROLES } from './user.constrants';

export const createUserValidation = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required!' })
      .min(2, 'Minimum 2 character is required!'),
    email: emailValidationSchema,
    password: passwordValidationSchema,
  }),
});

export const changeRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum([USER_ROLES.ADMIN, USER_ROLES.CUSTOMER], {
      required_error: 'Role is required!',
      invalid_type_error: 'Role must be either admin or customer!',
    }),
  }),
});
