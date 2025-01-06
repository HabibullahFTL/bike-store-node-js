import { Request, Response } from 'express';
import { generateResponse } from '../../utils/response-generator';
import ProductServices from '../products/products.services';
import OrderServices from './orders.services';
import { orderValidationSchema } from './orders.validations';

const createOrder = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = orderValidationSchema.safeParse(req.body);

    if (success && data) {
      // Fetching product data
      const productData = await ProductServices.getSingleProductFromDB(
        data?.product
      );

      // If no product is found, sending an error
      if (!productData) {
        const error = new Error('Product is not found');
        res.status(404).json(
          generateResponse({
            success: false,
            message: error?.message,
            stack: error?.stack,
            error,
          })
        );
      }

      // If there is no stock available sending an error
      if (productData && productData?.quantity <= 0) {
        const error = new Error('No stock available for this product');
        res.status(400).json(
          generateResponse({
            success: false,
            message: error?.message,
            stack: error?.stack,
            error,
          })
        );
      }

      // Creating an order
      const order = await OrderServices.createOrderInDB(data);

      if (order) {
        // Checking if order is found and then sending a success response
        res.status(201).json(
          generateResponse({
            success: true,
            message: 'Order created successfully',
            data: order,
          })
        );
      } else {
        // Sending an error if the order data is not found
        const error = new Error('Failed to create order');

        res.status(400).json(
          generateResponse({
            success: false,
            message: error?.message,
            stack: error?.stack,
            error,
          })
        );
      }
    } else {
      // Sending an error if there is any validation error
      res.status(400).json(
        generateResponse({
          success: false,
          message: (error as Error)?.message,
          stack: (error as Error)?.stack,
          error,
        })
      );
    }
  } catch (error) {
    // Sending an error if there is any error
    res.status(500).json(
      generateResponse({
        success: false,
        message: (error as Error)?.message || 'An unexpected error occurred',
        stack: (error as Error)?.stack,
        error,
      })
    );
  }
};

const OrderControllers = {
  createOrder,
};

export default OrderControllers;
