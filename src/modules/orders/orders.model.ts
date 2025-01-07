import { model, Schema, Types } from 'mongoose';
import { TOrder } from './orders.interfaces';

// Schema for orders
const orderSchema = new Schema<TOrder>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
      validate: {
        validator: function (value: string) {
          return Types.ObjectId.isValid(value);
        },
        message: 'Invalid Product ID',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
    },
  },
  { timestamps: true }
);

// Order Model
const OrderModel = model<TOrder>('Order', orderSchema);
export default OrderModel;
