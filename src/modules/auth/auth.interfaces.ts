import { z } from 'zod';
import { loginValidationSchema } from './auth.validations';

export type TokenType = 'access' | 'refresh';
export type TLogin = z.infer<typeof loginValidationSchema>;
