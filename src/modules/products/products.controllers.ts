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
  // Accepted search terms
  const validSearchTerms = ['name', 'brand', 'category'];

  // Getting search term & value
  const searchTerm = (req.query.searchTerm || '')?.toString()?.trim();
  const searchValue = (req.query.searchValue || '')?.toString()?.trim();

  // If searchTerm and searchValue are provided, fetch filtered products
  let products;
  if (validSearchTerms?.includes(searchTerm) && searchValue) {
    products = await ProductServices.getAllProductsFromDB(
      searchTerm,
      searchValue
    );
  } else {
    // If no filters provided, fetch all products
    products = await ProductServices.getAllProductsFromDB();
  }

  // Sending a success response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bikes retrieved successfully',
    data: products,
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
