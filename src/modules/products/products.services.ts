import { TProduct } from './products.interfaces';
import ProductsModel from './products.model';

// For creating product in database
const createProductIntoDB = async (productData: TProduct) => {
  const product = await ProductsModel.create(productData);
  return product;
};

// For updating product in database
const updateProductIntoDB = async (
  productId: string,
  productData: Partial<TProduct>
) => {
  // Perform the update
  const result = await ProductsModel.updateOne(
    { _id: productId },
    { $set: productData }
  );

  // Check if the product was found and updated
  if (result.modifiedCount === 0) {
    throw new Error('Bike not found');
  }

  // Optionally, retrieve the updated product
  const updatedProduct = await ProductsModel.findById(productId);

  return updatedProduct;
};

// For getting all the products from database
const getAllProductsFromDB = async (
  searchTerm?: string,
  searchValue?: string
) => {
  const query = searchTerm && searchValue ? { [searchTerm]: searchValue } : {};

  // Fetch products based on the query
  const products = await ProductsModel.find(query);
  return products;
};

// For getting specific product (bike) from database
const getSingleProductFromDB = async (productId: string) => {
  const product = await ProductsModel.findById(productId);
  return product;
};

// For deleting specific product (bike) from database
const deleteProductFromDB = async (productId: string) => {
  const result = await ProductsModel.deleteOne({
    _id: productId,
  });
  return result;
};

const ProductServices = {
  createProductIntoDB,
  updateProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  deleteProductFromDB,
};

export default ProductServices;
