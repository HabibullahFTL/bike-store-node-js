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

  let orderData = await OrderModel.findOne({
    'transaction.id': transactionId,
  });

  // If order is not found
  if (!orderData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order not found');
  }

  // If the payment is already verified and the payment status is already paid then returning the order data
  if (orderData?.transaction?.payment_status === 'Paid') {
    return orderData;
  }

  // If the payment is verified and the sp_code is 1000, updating order data
  if (
    verifiedPayment?.length &&
    verifiedPayment?.[0] &&
    Number(verifiedPayment?.[0]?.sp_code) == 1000
  ) {
    const timeLine = orderData?.timeLine || [];
    const isPaidTimeLine = timeLine.find((item) => item.status === 'paid');
    const paidTimeLine = {
      status: 'Paid',
      date_time: new Date(),
    };

    orderData = await OrderModel.findByIdAndUpdate(
      orderData?._id,
      {
        status: isPaidTimeLine ? orderData?.status : paidTimeLine.status,
        timeLine: isPaidTimeLine ? timeLine : [...timeLine, paidTimeLine],
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

const updateOrderStatusInDB = async (
  orderId: string,
  status: string,
  timeLine: { status: string; date_time: Date }[]
) => {
  const orderData = await OrderModel.findByIdAndUpdate(
    orderId,
    {
      status,
      timeLine,
    },
    { new: true }
  );
  if (!orderData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return orderData;
};

const getAllOrdersFromDB = async ({
  limit,
  page,
  userId,
}: {
  limit: number;
  page: number;
  userId?: string;
}) => {
  const skip = (page - 1) * limit;

  // Build the query to filter by userId if it's provided
  const query: Record<string, any> = {};
  if (userId) {
    query.user = userId;
  }

  const orders = await OrderModel.find(query)
    .sort({ createdAt: -1 })
    .populate('product')
    .skip(skip)
    .limit(limit);

  const totalItems = await OrderModel.countDocuments(query); // Use the same query for total count
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
  updateOrderStatusInDB,
};

export default OrderServices;
