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

// Handles the update a new product (bike)
const updateProduct = async (req: Request, res: Response) => {
  try {
    // Product Id
    const productId = req.params.productId;

    // Validating product schema
    const {
      success,
      data: validatedData,
      error,
    } = productValidationSchema.partial().safeParse(req.body);

    if (success && validatedData) {
      // Updating product using the service
      const updatedProduct = await ProductServices.updateProductIntoDB(
        productId,
        validatedData
      );

      if (!updatedProduct) {
        const error = new Error('Product not found');
        res.status(404).json(
          generateResponse({
            success: false,
            message: error?.message,
            stack: error?.stack,
            error: error,
          })
        );
      }

      // Sending a success response
      res.status(200).json(
        generateResponse({
          success: true,
          message: 'Bike updated successfully',
          data: updatedProduct,
        })
      );
    } else {
      // Sending a validation error response
      res.status(400).json(
        generateResponse({
          success: false,
          message: 'Invalid inputs for updating bike',
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
        message: (error as Error)?.message || 'Failed to update a bike',
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

    // Generating & sending error message if the product ID is not valid
    if (!ObjectId.isValid(productId)) {
      res.status(400).json(
        generateResponse({
          success: false,
          message: 'Invalid product ID format',
        })
      );
    }

    // Retrieving a bike
    const product = await ProductServices.getSingleProductFromDB(productId);

    if (!product) {
      // Handling if no product found
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
    } else {
      // Sending a success response
      res.status(200).json(
        generateResponse({
          success: true,
          message: 'Bike retrieved successfully',
          data: product,
        })
      );
    }
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

// Delete a specific product (bike)
const deleteProduct = async (req: Request, res: Response) => {
  try {
    // Getting product id
    const productId = req.params.productId?.toString().trim();

    // Generating & sending error message if the product ID is not valid
    if (!ObjectId.isValid(productId)) {
      res.status(400).json(
        generateResponse({
          success: false,
          message: 'Invalid product ID format',
        })
      );
    }

    // Deleting a bike
    const result = await ProductServices.deleteProductFromDB(productId);

    if (result?.deletedCount === 1) {
      // Sending a success response
      res.status(200).json(
        generateResponse({
          success: true,
          message: 'Bike deleted successfully',
          data: {},
        })
      );
    } else {
      // Handling if no product was deleted
      const error = new Error('No bike found to delete');

      res.status(404).json(
        generateResponse({
          success: false,
          message: error?.message,
          stack: error?.stack,
          error: error,
        })
      );
    }
  } catch (error) {
    // Sending a server error response
    res.status(500).json(
      generateResponse({
        success: false,
        message: 'Failed to delete bike',
        error: (error as Error)?.message || 'An unexpected error occurred',
        stack: (error as Error)?.stack,
      })
    );
  }
};

const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

export default ProductControllers;
