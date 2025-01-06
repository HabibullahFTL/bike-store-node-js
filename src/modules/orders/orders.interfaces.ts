import { ObjectId } from 'mongoose';
import { z } from 'zod';
import { orderValidationSchema } from './orders.validations';

export type TOrder = Pick<
  z.infer<typeof orderValidationSchema>,
  'email' | 'quantity' | 'totalPrice'
> & {
  product: ObjectId | string;
};
