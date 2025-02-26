import { z } from 'zod';
import { loginValidationSchema } from './auth.validations';

export type TLogin = z.infer<typeof loginValidationSchema>;
