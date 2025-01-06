import { TProduct } from './products.interfaces';
import ProductsModel from './products.model';

// For creating product in database
const createProductIntoDB = async (productData: TProduct) => {
  const product = await ProductsModel.create(productData);
  return product;
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

const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
};

export default ProductServices;
