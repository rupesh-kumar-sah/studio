
'use server';

import { revalidatePath } from 'next/cache';
import { 
    updateReview as dbUpdateReview, 
    deleteReview as dbDeleteReview,
    db,
    refreshProductCalculations
} from '@/lib/products-db';
import type { Product } from '@/lib/types';
import { z } from 'zod';

// Schema for validating product data from forms
const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().min(0, 'Price must be positive').optional(),
  stock: z.number().int().min(0, 'Stock must be a positive integer'),
  category: z.string().min(1, 'Category is required'),
  colors: z.string().min(1, "Please enter at least one color."),
  sizes: z.string().min(1, "Please enter at least one size."),
  purchaseLimit: z.number().int().min(1, 'Limit must be at least 1').optional(),
  // images are handled separately
});
export type ProductFormData = z.infer<typeof productSchema>;


export async function updateReview(productId: string, reviewId: string, comment: string, rating: number) {
    const result = await dbUpdateReview(productId, reviewId, comment, rating);
    if(result) {
        revalidatePath(`/products/${productId}`);
        revalidatePath('/admin/products');
        return { success: true };
    }
    return { success: false, message: 'Failed to update review.' };
}

export async function deleteReview(productId: string, reviewId: string) {
    const result = await dbDeleteReview(productId, reviewId);
     if(result) {
        revalidatePath(`/products/${productId}`);
        revalidatePath('/admin/products');
        return { success: true };
    }
    return { success: false, message: 'Failed to delete review.' };
}

export async function addProduct(data: ProductFormData) {
    const validation = productSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'Invalid product data.', errors: validation.error.flatten().fieldErrors };
    }

    const { colors, sizes, ...rest } = validation.data;

    // In a real app, you would handle image uploads and get URLs here.
    // For now, we'll use placeholder images.
    const newProduct: Omit<Product, 'id' | 'rating' | 'reviews' | 'detailedReviews'> = {
        ...rest,
        colors: colors.split(',').map(s => s.trim()),
        sizes: sizes.split(',').map(s => s.trim()),
        images: [
            { url: 'https://placehold.co/600x400', alt: 'Placeholder', hint: 'placeholder' },
            { url: 'https://placehold.co/600x400', alt: 'Placeholder', hint: 'placeholder' },
            { url: 'https://placehold.co/600x400', alt: 'Placeholder', hint: 'placeholder' },
        ],
    };
    
    const createdProduct: Product = {
      ...newProduct,
      id: new Date().getTime().toString(),
      rating: 0,
      reviews: 0,
      detailedReviews: [],
      purchaseLimit: newProduct.purchaseLimit || 10,
    };

    db.products = [createdProduct, ...db.products];

    revalidatePath('/products');
    revalidatePath('/admin/products');
    return { success: true, product: createdProduct };
}


export async function updateProduct(data: ProductFormData) {
    if (!data.id) {
        return { success: false, message: 'Product ID is missing.' };
    }
    const validation = productSchema.safeParse(data);
     if (!validation.success) {
        return { success: false, message: 'Invalid product data.', errors: validation.error.flatten().fieldErrors };
    }
    
    const { id, colors, sizes, ...rest } = validation.data;

    const existingProduct = db.products.find(p => p.id === id);
    if (!existingProduct) {
        return { success: false, message: 'Product not found.' };
    }

    const updatedProductData: Product = {
        ...existingProduct,
        ...rest,
        colors: colors.split(',').map(s => s.trim()),
        sizes: sizes.split(',').map(s => s.trim()),
    };

    const refreshedProduct = refreshProductCalculations(updatedProductData);
    db.products = db.products.map(p => p.id === id ? refreshedProduct : p);

    revalidatePath(`/products/${id}`);
    revalidatePath('/products');
    revalidatePath('/admin/products');

    return { success: true, product: refreshedProduct };
}

export async function deleteProduct(productId: string) {
    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.id !== productId);
    
    if (db.products.length < initialLength) {
        revalidatePath('/products');
        revalidatePath('/admin/products');
        return { success: true };
    }
    return { success: false, message: 'Product not found.' };
}
