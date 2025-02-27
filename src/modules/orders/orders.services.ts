import httpStatus from 'http-status';
import AppError from '../../errors/appError';
import ProductsModel from '../products/products.model';
import { TOrder } from './orders.interfaces';
import OrderModel from './orders.model';

const createOrderInDB = async (orderData: TOrder) => {
  // Finding product & updating quantity with inStock
  const productData = await ProductsModel.findOneAndUpdate(
    { _id: orderData?.product, quantity: { $gte: orderData?.quantity } },
    {
      $inc: { quantity: -orderData.quantity },
      inStock: true,
    },
    {
      new: true,
    }
  );

  // If product quantity is insufficient
  if (!productData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Insufficient stock or product not found'
    );
  }

  // If the quantity is zero or less than zero of previously updated product data, updating quantity with inStock field
  if (productData && productData?.quantity <= 0) {
    productData.quantity = 0;
    productData.inStock = false;

    productData.save();
  }

  // Creating order
  const order = await OrderModel.create(orderData);

  return order;
};

const getAllOrdersFromDB = async () => {
  return await OrderModel.find().sort({ createdAt: -1 });
};

const calculateRevenueFromDB = async () => {
  const revenue = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  return { totalRevenue: revenue[0]?.totalRevenue || 0 };
};

const OrderServices = {
  createOrderInDB,
  getAllOrdersFromDB,
  calculateRevenueFromDB,
};

export default OrderServices;
