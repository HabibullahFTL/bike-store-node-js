import { Router } from 'express';
import authGuard from '../../middlewares/authGuard';
import { validateRequest } from '../../middlewares/validateRequest';
import { USER_ROLES } from '../user/user.constrants';
import ProductControllers from './products.controllers';
import {
  productValidationSchema,
  updateProductValidationSchema,
} from './products.validation';

const ProductsRouter = Router();

// Route to create a new product
ProductsRouter.post(
  '/',
  validateRequest(productValidationSchema),
  authGuard(USER_ROLES.ADMIN),
  ProductControllers.createProduct
);
// Route to update a new product
ProductsRouter.put(
  '/:productId',
  validateRequest(updateProductValidationSchema),
  authGuard(USER_ROLES.ADMIN),
  ProductControllers.updateProduct
);
// Route to delete specific product
ProductsRouter.delete(
  '/:productId',
  authGuard(USER_ROLES.ADMIN),
  ProductControllers.deleteProduct
);
// Route to get all products
ProductsRouter.get('/', ProductControllers.getAllProducts);
// Route to get specific product
ProductsRouter.get('/:productId', ProductControllers.getSingleProduct);

export default ProductsRouter;
