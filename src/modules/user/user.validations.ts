import { z } from 'zod';
import {
  emailValidationSchema,
  passwordValidationSchema,
} from '../auth/auth.validations';

export const createUserValidation = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required!' })
      .min(2, 'Minimum 2 character is required!'),
    email: emailValidationSchema,
    password: passwordValidationSchema,
  }),
});
