import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import ProductsModel from '../products/products.model';
import { TUser } from '../user/user.interfaces';
import { TCreateOrderData } from './orders.interfaces';
import OrderModel from './orders.model';
import { makePaymentAsync, verifyPaymentAsync } from './orders.utils';

const createOrderInDB = async (
  user: TUser,
  orderData: TCreateOrderData,
  client_ip: string
) => {
  // Finding product & updating quantity with inStock
  const productData = await ProductsModel.findOneAndUpdate(
    { _id: orderData?.product, quantity: { $gte: orderData?.quantity } },
    {
      $inc: { quantity: -orderData.quantity },
      inStock: true,
    },
    { new: true }
  );

  // If product quantity is insufficient
  if (!productData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Insufficient stock or product not found'
    );
  }

  // If the quantity is zero or less than zero of previously updated product data, updating quantity with inStock field
  if (productData && productData?.quantity <= 0) {
    productData.quantity = 0;
    productData.inStock = false;

    productData.save();
  }

  // Creating order
  const order = await OrderModel.create(orderData);

  // Shurjo pay payment integration
  const paymentPayload = {
    amount: orderData?.totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: user?.name,
    customer_address: orderData?.shippingAddress,
    customer_email: user.email,
    customer_phone: orderData?.phone,
    customer_city: orderData?.shippingAddress,
    client_ip,
  };

  const paymentResponse = await makePaymentAsync(paymentPayload);
  const transactionData = {
    id: paymentResponse?.sp_order_id,
    checkoutURL: paymentResponse?.checkout_url,
    transactionStatus: paymentResponse?.transactionStatus,
  };

  await order.updateOne({ transaction: transactionData });

  return {
    _id: order?._id,
    checkoutURL: transactionData?.checkoutURL,
  };
};

const verifyPaymentWithGateway = async (transactionId: string) => {
  const verifiedPayment = await verifyPaymentAsync(transactionId);

  let orderData;

  if (
    verifiedPayment?.length &&
    verifiedPayment?.[0] &&
    Number(verifiedPayment?.[0]?.sp_code) == 1000
  ) {
    orderData = await OrderModel.findOneAndUpdate(
      { 'transaction.id': transactionId },
      {
        'transaction.checkoutURL': '',
        'transaction.bank_status': verifiedPayment?.[0]?.bank_status,
        'transaction.sp_code': verifiedPayment?.[0]?.sp_code,
        'transaction.method': verifiedPayment?.[0]?.method,
        'transaction.status': verifiedPayment?.[0]?.transaction_status,
        'transaction.date_time': verifiedPayment?.[0]?.date_time,
        'transaction.payment_status':
          verifiedPayment?.[0]?.bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
            ? 'Pending'
            : verifiedPayment[0].bank_status == 'Cancel'
            ? 'Cancelled'
            : '',
      },
      {
        new: true,
      }
    );
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid transaction id');
  }

  return orderData;
};

const getAllOrdersFromDB = async ({
  limit,
  page,
}: {
  limit: number;
  page: number;
}) => {
  const skip = (page - 1) * limit;

  const orders = await OrderModel.find()
    .sort({ createdAt: -1 })
    .populate('product')
    .skip(skip)
    .limit(limit);

  const totalItems = await OrderModel.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  return { orders, meta: { page, limit, totalItems, totalPages } };
};

const getOrderDetailsFromDB = async (orderId: string) => {
  return await OrderModel.findById(orderId).populate('product');
};

const calculateRevenueFromDB = async () => {
  const revenue = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  return { totalRevenue: revenue[0]?.totalRevenue || 0 };
};

const OrderServices = {
  createOrderInDB,
  getAllOrdersFromDB,
  getOrderDetailsFromDB,
  calculateRevenueFromDB,
  verifyPaymentWithGateway,
};

export default OrderServices;
