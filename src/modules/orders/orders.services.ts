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
    throw new Error('Insufficient stock or product not found');
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

const OrderServices = { createOrderInDB };

export default OrderServices;
