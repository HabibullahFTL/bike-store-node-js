import { z } from 'zod';
import { productValidationSchema } from './products.validation';

export type TProduct = z.infer<typeof productValidationSchema>['body'];
