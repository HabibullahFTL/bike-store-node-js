import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ObjectId } from 'mongodb';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response-generator';
import ProductServices from './products.services';
import {
  productValidationSchema,
  updateProductValidationSchema,
} from './products.validation';

// Handles the creation of a new product (bike)
const createProduct = catchAsync(async (req: Request, res: Response) => {
  // Validating product schema
  const {
    success,
    data: validatedData,
    error,
  } = productValidationSchema.safeParse(req);

  if (success && validatedData) {
    // Creating product using the service
    const productData = await ProductServices.createProductIntoDB(
      validatedData.body
    );

    // Sending a success response
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Bike created successfully',
      data: productData,
    });
  } else {
    // Sending a validation error response
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid inputs for creating bike'
    );
  }
});

// Handles the update a new product (bike)
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  // Product Id
  const productId = req.params.productId;

  // Validating product schema
  const {
    success,
    data: validatedData,
    error,
  } = updateProductValidationSchema.safeParse(req);

  if (success && validatedData) {
    // Updating product using the service
    const updatedProduct = await ProductServices.updateProductIntoDB(
      productId,
      validatedData?.body!
    );

    if (!updatedProduct) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
    }

    // Sending a success response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bike updated successfully',
      data: updatedProduct,
    });
  } else {
    // Sending a validation error response
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid inputs for updating bike'
    );
  }
});

// Retrieves a list of all products (bikes)
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const validSearchTerms = ['name', 'brand', 'category'];

  // Getting search term & value
  const tempSearchTerm = (req.query.searchTerm || '')?.toString()?.trim();
  const searchTerm = validSearchTerms?.includes(tempSearchTerm)
    ? tempSearchTerm
    : '';
  const searchValue = searchTerm
    ? (req.query.searchValue || '')?.toString()?.trim()
    : '';

  // Getting filters
  const category = req.query.category
    ? req.query.category.toString().trim()
    : undefined;
  const brand = req.query.brand ? req.query.brand.toString().trim() : undefined;
  const minPrice = req.query.minPrice
    ? parseInt(req.query.minPrice.toString())
    : undefined;
  const maxPrice = req.query.maxPrice
    ? parseInt(req.query.maxPrice.toString())
    : undefined;
  const inStock = req.query.inStock
    ? req.query.inStock.toString() === 'true'
    : undefined;

  // Getting limit & page
  const defaultLimit = 10;
  const defaultPage = 1;
  const limit = parseInt((req.query.limit || defaultLimit)?.toString());
  const page = parseInt((req.query.page || defaultPage)?.toString());

  // Getting sortBy & sortOrder
  const validSortBys = ['name', 'brand', 'price', 'category', 'createdAt'];
  const validSortOrders = ['asc', 'desc'];

  const tempSortBy = (req.query.sortBy || '')?.toString()?.trim();
  const sortBy = validSortBys?.includes(tempSortBy) ? tempSortBy : 'createdAt';
  const tempSortOrder = (req.query.sortOrder || '')?.toString()?.trim();
  const sortOrder = validSortOrders?.includes(tempSortOrder)
    ? tempSortOrder
    : 'desc';

  // Fetch products with all filters
  const results = await ProductServices.getAllProductsFromDB({
    searchTerm,
    searchValue,
    category,
    brand,
    minPrice,
    maxPrice,
    inStock,
    limit: limit || defaultLimit,
    page: page || defaultPage,
    sortBy,
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bikes retrieved successfully',
    data: results.products,
    meta: results.meta,
  });
});

// Retrieves a specific product (bike)
const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  // Getting product id
  const productId = req.params.productId?.toString().trim();

  // Generating & sending error message if the product ID is not valid
  if (!ObjectId.isValid(productId)) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Invalid product ID format',
    });
  }

  // Retrieving a bike
  const product = await ProductServices.getSingleProductFromDB(productId);

  if (!product) {
    // Handling if no product found
    throw new AppError(httpStatus.NOT_FOUND, 'No bike found');
  } else {
    // Sending a success response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bike retrieved successfully',
      data: product,
    });
  }
});

// Delete a specific product (bike)
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  // Getting product id
  const productId = req.params.productId?.toString().trim();

  // Generating & sending error message if the product ID is not valid
  if (!ObjectId.isValid(productId)) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Invalid product ID format',
    });
  }

  // Deleting a bike
  const result = await ProductServices.deleteProductFromDB(productId);

  if (result?.deletedCount === 1) {
    // Sending a success response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Bike deleted successfully',
      data: {},
    });
  } else {
    // Handling if no product was deleted
    throw new AppError(httpStatus.NOT_FOUND, 'No bike found to delete');
  }
});

const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

export default ProductControllers;
