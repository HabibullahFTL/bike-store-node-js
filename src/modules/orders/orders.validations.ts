import { z } from 'zod';

export const orderValidationSchema = z.object({
  body: z.object({
    productId: z
      .string({ required_error: 'Product ID is required' })
      .regex(/^[a-f\d]{24}$/i, {
        message: 'Invalid product ID format (must be a valid ObjectId)',
      }),
    quantity: z
      .number({ required_error: 'Quantity is required' })
      .nonnegative('Quantity should not be a negative value'),
    totalPrice: z
      .number({ required_error: 'Total price is required' })
      .nonnegative('Total price should not be a negative value'),
    shippingAddress: z
      .string({ required_error: 'Shipping address is required' })
      .min(2, 'Minimum 2 character is required'),
  }),
});
