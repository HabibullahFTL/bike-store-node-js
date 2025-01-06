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

// For getting specific product (bike) from database
const getSingleProductFromDB = async (productId: string) => {
  // Fetch product based on the productId
  const products = await ProductsModel.findOne({ _id: productId });
  return products;
};

const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
};

export default ProductServices;
