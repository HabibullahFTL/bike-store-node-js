import { Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response-generator';
import ProductServices from '../products/products.services';
import { TUser } from '../user/user.interfaces';
import { TCreateOrderData } from './orders.interfaces';
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

// Retrieves a list of all orders
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrdersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Retrieved all the orders.',
    data: result,
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
};

export default OrderControllers;
