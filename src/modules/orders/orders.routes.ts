import { Router } from 'express';
import OrderControllers from './orders.controllers';

const OrdersRouter = Router();

// Route to create a new order
OrdersRouter.post('/', OrderControllers.createOrder);
// Route to get all orders (I made it for check orders)
OrdersRouter.get('/', OrderControllers.getAllOrders);
// Route to get total revenue data
OrdersRouter.get('/revenue', OrderControllers.calculateRevenue);

export default OrdersRouter;
