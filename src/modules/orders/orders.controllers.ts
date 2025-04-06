import { Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response-generator';
import ProductServices from '../products/products.services';
import { TUser } from '../user/user.interfaces';
import { orderStatusTransitions } from './orders.constrants';
import { TCreateOrderData, TOrderStatus } from './orders.interfaces';
import OrderServices from './orders.services';

// Handles the creation of a new order
const createOrder = catchAsync(async (req: Request, res: Response) => {
  // Fetching product data
  const productData = await ProductServices.getSingleProductFromDB(
    req?.body?.productId
  );

  // If no product is found, sending an error
  if (!productData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product is not found');
  }

  // If there is no stock available sending an error
  if (productData && productData?.quantity <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'No stock available for this product'
    );
  }

  const orderData: TCreateOrderData = {
    product: req?.body?.productId,
    quantity: req?.body?.quantity,
    totalPrice: req?.body?.totalPrice,
    shippingAddress: req?.body?.shippingAddress,
    phone: req?.body?.phone,
    user: req?.user?._id || '',
    status: 'Processing',
    timeLine: [
      {
        status: 'Processing',
        date_time: new Date(),
      },
    ],
  };

  // Creating an order
  const order = await OrderServices.createOrderInDB(
    req?.user as TUser,
    orderData,
    req?.ip as string
  );

  if (order) {
    // Checking if order is found and then sending a success response
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } else {
    // Sending an error if the order data is not found
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create order');
  }
});

// Handles verify payment
const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const transactionId = (req?.query?.transactionId || '')?.toString();

  if (!transactionId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Transaction ID is required!');
  }

  const result = await OrderServices.verifyPaymentWithGateway(transactionId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    data: result,
    message: 'Order created successfully',
  });
});

// Handles the order status update
const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Checking if order is found
  const order = await OrderServices.getOrderDetailsFromDB(orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  const timeLine = order?.timeLine || [];
  const newTimeLineItem = { status, date_time: new Date() };
  const currentStatus = order.status;

  // Allowed statuses
  const validStatuses: TOrderStatus[] = [
    'Shipped',
    'Delivered',
    'Cancelled',
    'Refunded',
  ];
  if (!validStatuses.includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid status. Allowed statuses are: ${validStatuses.join(', ')}`
    );
  }

  // Prevent updates if already Refunded
  if (currentStatus === 'Refunded') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Order is already refunded. Status cannot be updated.`
    );
  }

  // Validate allowed transitions using the exported transition object
  const allowedNextStatuses = orderStatusTransitions[currentStatus] || [];

  if (!allowedNextStatuses.includes(status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid transition from ${currentStatus} to ${status}. Allowed: ${
        allowedNextStatuses.join(', ') || 'none'
      }`
    );
  }

  // Perform update
  const result = await OrderServices.updateOrderStatusInDB(orderId, status, [
    ...timeLine,
    newTimeLineItem,
  ]);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Order status updated successfully',
    data: result,
  });
});

// Retrieves a list of all orders
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  // Getting limit & page
  const defaultLimit = 10;
  const defaultPage = 1;
  const limit = parseInt((req.query.limit || defaultLimit)?.toString());
  const page = parseInt((req.query.page || defaultPage)?.toString());

  const userId = req?.user?.role === 'admin' ? undefined : req?.user?._id;

  const result = await OrderServices.getAllOrdersFromDB({
    limit,
    page,
    userId,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Retrieved all the orders.',
    data: result?.orders,
    meta: result?.meta,
  });
});

// Retrieve order details
const getOrderDetails = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const result = await OrderServices.getOrderDetailsFromDB(orderId);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product not found');
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Retrieved all the orders.',
    data: result,
  });
});

// Calculates and send a response of total revenue
const calculateRevenue = async (req: Request, res: Response) => {
  const result = await OrderServices.calculateRevenueFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Revenue calculated successfully',
    data: result,
  });
};

const OrderControllers = {
  createOrder,
  calculateRevenue,
  getAllOrders,
  getOrderDetails,
  verifyPayment,
  updateOrderStatus,
};

export default OrderControllers;
