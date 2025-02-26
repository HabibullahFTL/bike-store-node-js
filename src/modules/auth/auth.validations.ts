import { z } from 'zod';
import { refreshTokenName } from './auth.constrants';

export const emailValidationSchema = z
  .string({ required_error: 'Email address is required!' })
  .email();
export const passwordValidationSchema = z
  .string({ required_error: 'Password is required!' })
  .min(6, 'Minimum 6 character is required!');

export const loginValidationSchema = z.object({
  body: z.object({
    email: emailValidationSchema,
    password: passwordValidationSchema,
  }),
});

export const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: passwordValidationSchema,
    newPassword: passwordValidationSchema,
  }),
});

export const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    [refreshTokenName]: z.string(),
  }),
});
