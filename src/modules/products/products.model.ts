import { model, Schema } from 'mongoose';
import { TProduct } from './products.interfaces';
import { categoryArray } from './products.validation';

const productSchema = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [30, 'Product name cannot exceed 30 characters'],
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a non-negative number'],
    },
    category: {
      type: String,
      enum: categoryArray,
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Description cannot be empty',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity must be a non-negative number'],
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const ProductsModel = model<TProduct>('Product', productSchema);

export default ProductsModel;
