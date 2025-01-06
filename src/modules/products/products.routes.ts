import { Router } from 'express';
import ProductControllers from './products.controllers';

const ProductsRouter = Router();

// Route to create a new product
ProductsRouter.post('/', ProductControllers.createProduct);
// Route to update a new product
ProductsRouter.put('/:productId', ProductControllers.updateProduct);
// Route to get all products
ProductsRouter.get('/', ProductControllers.getAllProducts);
// Route to get specific product
ProductsRouter.get('/:productId', ProductControllers.getSingleProduct);
// Route to delete specific product
ProductsRouter.delete('/:productId', ProductControllers.deleteProduct);

export default ProductsRouter;
