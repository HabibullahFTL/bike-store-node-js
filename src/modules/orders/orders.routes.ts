import { Router } from 'express';
import OrderControllers from './orders.controllers';

const OrdersRouter = Router();

OrdersRouter.post('/', OrderControllers.createOrder);
OrdersRouter.get('/', OrderControllers.getAllOrders);
OrdersRouter.get('/revenue', OrderControllers.calculateRevenue);

export default OrdersRouter;
