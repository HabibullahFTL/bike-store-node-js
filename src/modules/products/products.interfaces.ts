import { z } from 'zod';
import { productValidationSchema } from './products.validation';

export type TProduct = z.infer<typeof productValidationSchema>['body'];

export type TProductsQuery = {
  searchTerm?: string;
  searchValue?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};
