import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TProduct, TProductsQuery } from './products.interfaces';
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
    throw new AppError(httpStatus.NOT_FOUND, 'Bike not found');
  }

  // Optionally, retrieve the updated product
  const updatedProduct = await ProductsModel.findById(productId);

  return updatedProduct;
};

// For getting all the products from database
const getAllProductsFromDB = async ({
  searchTerm,
  searchValue,
  category,
  brand,
  minPrice,
  maxPrice,
  inStock,
  limit,
  page,
  sortBy,
  sortOrder,
}: TProductsQuery) => {
  // Base query
  const query: Record<string, any> = {};

  // Apply search filtering
  if (searchTerm && searchValue) {
    query[searchTerm] = { $regex: searchValue, $options: 'i' };
  }

  // Apply additional filters
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (minPrice !== undefined) query.price = { ...query.price, $gte: minPrice };
  if (maxPrice !== undefined) query.price = { ...query.price, $lte: maxPrice };
  if (inStock !== undefined) query.inStock = inStock;

  const skip = (page - 1) * limit;

  // Fetch products based on the query
  const products = await ProductsModel.find(query)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const totalItems = await ProductsModel.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    meta: { page, limit, totalItems, totalPages },
    products,
  };
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
