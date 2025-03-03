import { Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response-generator';
import ProductServices from '../products/products.services';
import OrderServices from './orders.services';
import { orderValidationSchema } from './orders.validations';

// Handles the creation of a new order
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { success, data, error } = orderValidationSchema.safeParse(req.body);

  if (success && data) {
    // Fetching product data
    const productData = await ProductServices.getSingleProductFromDB(
      data?.product
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

    // Creating an order
    const order = await OrderServices.createOrderInDB(data);

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
  } else {
    // Sending an error if there is any validation error
    throw new AppError(
      httpStatus.BAD_REQUEST,
      (error as Error)?.message || 'Invalid order inputs'
    );
  }
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
};

export default OrderControllers;
