import { Router } from 'express';
import AuthRouter from '../modules/auth/auth.routes';
import OrdersRouter from '../modules/orders/orders.routes';
import ProductsRouter from '../modules/products/products.routes';
import UserRouter from '../modules/user/user.routes';

const APIRouter = Router();

APIRouter.use('/auth', AuthRouter);
APIRouter.use('/user', UserRouter);
APIRouter.use('/products', ProductsRouter);
APIRouter.use('/orders', OrdersRouter);

export default APIRouter;
