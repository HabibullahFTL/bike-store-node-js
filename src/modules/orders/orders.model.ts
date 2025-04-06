import { model, Schema, Types } from 'mongoose';
import { TOrder } from './orders.interfaces';

// Schema for orders
const orderSchema = new Schema<TOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
      validate: {
        validator: function (value: string) {
          return Types.ObjectId.isValid(value);
        },
        message: 'Invalid User ID',
      },
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
    shippingAddress: {
      type: String,
      required: [true, 'Total price is required'],
    },
    status: {
      type: String,
      enum: [
        'Processing',
        'Paid',
        'Shipped',
        'Delivered',
        'Cancelled',
        'Refunded',
      ],
      default: 'Processing',
    },
    timeLine: {
      type: [
        {
          status: {
            type: String,
            enum: [
              'Processing',
              'Paid',
              'Shipped',
              'Delivered',
              'Cancelled',
              'Refunded',
            ],
            default: 'Processing',
          },
          date_time: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      required: [true, 'Time line is required'],
    },
    transaction: {
      id: String,
      checkoutURL: String,
      sp_code: String,
      date_time: String,
      method: String,
      status: String,
      bank_status: String,
      payment_status: String,
    },
  },
  { timestamps: true }
);

// Order Model
const OrderModel = model<TOrder>('Order', orderSchema);
export default OrderModel;
