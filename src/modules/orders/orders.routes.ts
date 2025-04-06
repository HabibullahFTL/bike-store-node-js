import { Router } from 'express';
import authGuard from '../../middlewares/authGuard';
import { validateRequest } from '../../middlewares/validateRequest';
import { USER_ROLES } from '../user/user.constrants';
import OrderControllers from './orders.controllers';
import {
  orderStatusUpdateValidationSchema,
  orderValidationSchema,
} from './orders.validations';

const OrdersRouter = Router();

// Route to create a new order
OrdersRouter.post(
  '/',
  authGuard(USER_ROLES.CUSTOMER),
  validateRequest(orderValidationSchema),
  OrderControllers.createOrder
);

// Route to verify a order
OrdersRouter.get(
  '/verify-payment',
  authGuard(USER_ROLES.CUSTOMER),
  OrderControllers.verifyPayment
);

// Route to update order status
OrdersRouter.patch(
  '/update-status/:orderId',
  authGuard(USER_ROLES.ADMIN),
  validateRequest(orderStatusUpdateValidationSchema),
  OrderControllers.updateOrderStatus
);

// Route to get all orders
OrdersRouter.get(
  '/',
  authGuard(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN),
  OrderControllers.getAllOrders
);

// Route to get order details by id
OrdersRouter.get(
  '/:orderId',
  authGuard(USER_ROLES.CUSTOMER, USER_ROLES.ADMIN),
  OrderControllers.getOrderDetails
);
// Route to get total revenue data
OrdersRouter.get('/revenue', OrderControllers.calculateRevenue);

export default OrdersRouter;
