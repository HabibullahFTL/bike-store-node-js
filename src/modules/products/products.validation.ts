import { z } from 'zod';

export const categoryArray: ['Mountain', 'Road', 'Hybrid', 'Electric'] = [
  'Mountain',
  'Road',
  'Hybrid',
  'Electric',
];

const productDataValidationSchema = z.object({
  name: z
    .string({ required_error: 'Product name is required' })
    .min(2, 'Product name must be at least 2 characters')
    .max(30, 'Product name cannot exceed 30 characters'),
  brand: z
    .string({ required_error: 'Brand is required' })
    .min(1, 'Brand is required'),
  price: z
    .number({ required_error: 'Price is required' })
    .nonnegative('Price must be a non-negative number'),
  category: z.enum(categoryArray),
  description: z
    .string({ required_error: 'Description is required' })
    .min(1, 'Description cannot be empty'),
  quantity: z
    .number({ required_error: 'Quantity is required' })
    .nonnegative('Quantity must be a non-negative number'),
  inStock: z.boolean().default(true),
});

export const productValidationSchema = z.object({
  body: productDataValidationSchema,
});

export const updateProductValidationSchema = z.object({
  body: productDataValidationSchema.partial(),
});
