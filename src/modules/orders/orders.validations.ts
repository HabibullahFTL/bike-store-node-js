import { z } from 'zod';

export const orderValidationSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('This is not a valid email address'),
  //   product: z.custom(),
  product: z
    .string({ required_error: 'Product is required' })
    .regex(/^[a-f\d]{24}$/i, {
      message: 'Invalid product ID format (must be a valid ObjectId)',
    }),
  quantity: z
    .number({ required_error: 'Quantity is required' })
    .nonnegative('Quantity should not be a negative value'),
  totalPrice: z
    .number({ required_error: 'Total price is required' })
    .nonnegative('Total price should not be a negative value'),
});
