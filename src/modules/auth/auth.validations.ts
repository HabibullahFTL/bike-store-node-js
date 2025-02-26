import { z } from 'zod';

export const emailValidationSchema = z
  .string({ required_error: 'Email address is required!' })
  .email();
export const passwordValidationSchema = z
  .string({ required_error: 'Password is required!' })
  .min(6, 'Minimum 6 character is required!');

export const loginValidationSchema = z.object({
  email: emailValidationSchema,
  password: passwordValidationSchema,
});
