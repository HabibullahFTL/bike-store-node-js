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
  try {
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
  } catch (error) {
    throw error;
  }
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
  const products = await ProductsModel.findById(productId);
  return products;
};

const ProductServices = {
  createProductIntoDB,
  updateProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
};

export default ProductServices;
