import { Router } from 'express';
import authGuard from '../../middlewares/authGuard';
import { USER_ROLES } from '../user/user.constrants';
import OrderControllers from './orders.controllers';

const OrdersRouter = Router();

// Route to create a new order
OrdersRouter.post(
  '/',
  authGuard(USER_ROLES.CUSTOMER),
  OrderControllers.createOrder
);
// Route to get all orders (I made it for check orders)
OrdersRouter.get(
  '/',
  authGuard(USER_ROLES.CUSTOMER),
  OrderControllers.getAllOrders
);
// Route to get total revenue data
OrdersRouter.get('/revenue', OrderControllers.calculateRevenue);

export default OrdersRouter;
