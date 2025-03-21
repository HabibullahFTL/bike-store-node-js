import { ObjectId } from 'mongoose';
import { z } from 'zod';
import { orderValidationSchema } from './orders.validations';

export type TOrder = Pick<
  z.infer<typeof orderValidationSchema>['body'],
  'quantity' | 'totalPrice' | 'shippingAddress'
> & {
  product: ObjectId | string;
  user: ObjectId | string;
  transaction?: {
    id: string;
    checkoutURL?: string;
    status: string;
  };
};

export type TCreateOrderData = TOrder & { phone: string };
