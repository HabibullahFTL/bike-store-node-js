import { Router } from 'express';
import ProductControllers from './products.controllers';

const ProductsRouter = Router();

// Route to create a new product
ProductsRouter.post('/', ProductControllers.createProduct);
// Route to get all products
ProductsRouter.get('/', ProductControllers.getAllProducts);

export default ProductsRouter;
