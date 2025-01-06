import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { generateResponse } from '../../utils/response-generator';
import ProductServices from './products.services';
import { productValidationSchema } from './products.validation';

// Handles the creation of a new product (bike)
const createProduct = async (req: Request, res: Response) => {
  try {
    // Validating product schema
    const {
      success,
      data: validatedData,
      error,
    } = productValidationSchema.safeParse(req.body);

    if (success && validatedData) {
      // Creating product using the service
      const productData = await ProductServices.createProductIntoDB(
        validatedData
      );

      // Sending a success response
      res.status(201).json(
        generateResponse({
          success: true,
          message: 'Bike created successfully',
          data: productData,
        })
      );
    } else {
      // Sending a validation error response
      res.status(400).json(
        generateResponse({
          success: false,
          message: 'Invalid inputs for creating bike',
          error: error || 'Validation error occurred',
          stack: error.stack,
        })
      );
    }
  } catch (error) {
    // Sending a server error response
    res.status(500).json(
      generateResponse({
        success: false,
        message: 'Failed to create a bike',
        error: (error as Error)?.message || 'An unexpected error occurred',
        stack: (error as Error)?.stack,
      })
    );
  }
};

// Retrieves a list of all products (bikes)
const getAllProducts = async (req: Request, res: Response) => {
  try {
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
    res.status(200).json(
      generateResponse({
        success: true,
        message: 'Bikes retrieved successfully',
        data: products,
      })
    );
  } catch (error) {
    // Sending a server error response
    res.status(500).json(
      generateResponse({
        success: false,
        message: 'Failed to retrieve bikes',
        error: (error as Error)?.message || 'An unexpected error occurred',
        stack: (error as Error)?.stack,
      })
    );
  }
};

// Retrieves a specific product (bike)
const getSingleProduct = async (req: Request, res: Response) => {
  try {
    // Getting product id
    const productId = req.params.productId?.toString().trim();

    // Retrieving a bike
    const product = await ProductServices.getSingleProductFromDB(productId);

    if (!ObjectId.isValid(productId)) {
      res.status(400).json(
        generateResponse({
          success: false,
          message: 'Invalid product ID format',
        })
      );
    }

    // Handling if no product found
    if (!product) {
      const error = new Error('No bike found');
      // Sending an error response
      res.status(404).json(
        generateResponse({
          success: false,
          message: error?.message,
          error: error,
          stack: (error as Error)?.stack,
        })
      );
    }

    // Sending a success response
    res.status(200).json(
      generateResponse({
        success: true,
        message: 'Bike retrieved successfully',
        data: product,
      })
    );
  } catch (error) {
    // Sending a server error response
    res.status(500).json(
      generateResponse({
        success: false,
        message: 'Failed to retrieve bike',
        error: (error as Error)?.message || 'An unexpected error occurred',
        stack: (error as Error)?.stack,
      })
    );
  }
};

const ProductControllers = { createProduct, getAllProducts, getSingleProduct };

export default ProductControllers;
