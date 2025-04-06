import { ObjectId } from 'mongoose';
import { z } from 'zod';
import { orderStatuses } from './orders.constrants';
import { orderValidationSchema } from './orders.validations';

export type TOrderStatus = (typeof orderStatuses)[number];

export type TOrder = Pick<
  z.infer<typeof orderValidationSchema>['body'],
  'quantity' | 'totalPrice' | 'shippingAddress'
> & {
  product: ObjectId | string;
  user: ObjectId | string;
  status: TOrderStatus;
  timeLine: {
    status: string;
    date_time: Date;
  }[];
  transaction?: {
    id: string;
    checkoutURL?: string;
    status?: string;
    sp_code?: String;
    date_time?: String;
    method?: String;
    bank_status?: String;
    payment_status?: String;
  };
};

export type TCreateOrderData = TOrder & { phone: string };
