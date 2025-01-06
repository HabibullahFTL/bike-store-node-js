import { Router } from 'express';
import OrderControllers from './orders.controllers';

const OrdersRouter = Router();

OrdersRouter.post('/', OrderControllers.createOrder);

export default OrdersRouter;
