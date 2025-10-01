
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Product, Review } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

// Path to the JSON file that acts as our database
const dbPath = path.join(process.cwd(), 'src', 'lib', 'products.json');

// --- Helper Functions to Read/Write from JSON file ---

async function readDb(): Promise<{ products: Product[] }> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const jsonData = JSON.parse(data);
    return jsonData && Array.isArray(jsonData.products) ? jsonData : { products: [] };
  } catch (error) {
    // If the file doesn't exist or is empty, return a default structure
    console.error("Error reading products DB:", error);
    return { products: [] };
  }
}

async function writeDb(data: { products: Product[] }): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing to products DB:", error);
  }
}

// --- Schema for validating product data from forms ---
const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().min(0, 'Price must be positive').optional().nullable(),
  stock: z.number().int().min(0, 'Stock must be a positive integer'),
  category: z.string().min(1, 'Category is required'),
  colors: z.string().min(1, "Please enter at least one color."),
  sizes: z.string().min(1, "Please enter at least one size."),
  purchaseLimit: z.number().int().min(1, 'Limit must be at least 1').optional(),
  image1: z.string().min(1, 'First image is required.'),
  image2: z.string().min(1, 'Second image is required.'),
  image3: z.string().min(1, 'Third image is required.'),
});
export type ProductFormData = z.infer<typeof productSchema>;


// --- Main Action Functions ---

/**
 * Adds a new product to the database.
 */
export async function addProduct(data: ProductFormData) {
    const validation = productSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'Invalid product data.', errors: validation.error.flatten().fieldErrors };
    }

    const { colors, sizes, image1, image2, image3, ...rest } = validation.data;
    
    const db = await readDb();

    const newProduct: Product = {
        ...rest,
        id: new Date().getTime().toString(),
        rating: 0,
        reviews: 0,
        detailedReviews: [],
        colors: colors.split(',').map(s => s.trim()),
        sizes: sizes.split(',').map(s => s.trim()),
        images: [
            { url: image1, alt: rest.name, hint: 'product photo' },
            { url: image2, alt: rest.name, hint: 'product photo' },
            { url: image3, alt: rest.name, hint: 'product photo' },
        ],
        purchaseLimit: rest.purchaseLimit || 10,
        originalPrice: rest.originalPrice === null ? undefined : rest.originalPrice,
    };
    
    db.products.unshift(newProduct);
    await writeDb(db);

    revalidatePath('/products');
    revalidatePath('/admin/products');
    return { success: true, product: newProduct };
}

/**
 * Updates an existing product.
 */
export async function updateProduct(data: ProductFormData) {
    if (!data.id) {
        return { success: false, message: 'Product ID is missing.' };
    }
    const validation = productSchema.safeParse(data);
     if (!validation.success) {
        return { success: false, message: 'Invalid product data.', errors: validation.error.flatten().fieldErrors };
    }
    
    const { id, colors, sizes, image1, image2, image3, ...rest } = validation.data;

    const db = await readDb();
    const productIndex = db.products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return { success: false, message: 'Product not found.' };
    }

    const existingProduct = db.products[productIndex];

    const updatedProductData: Product = {
        ...existingProduct,
        ...rest,
        originalPrice: rest.originalPrice === null ? undefined : rest.originalPrice,
        colors: colors.split(',').map(s => s.trim()),
        sizes: sizes.split(',').map(s => s.trim()),
        images: [
            { url: image1, alt: rest.name, hint: 'product photo' },
            { url: image2, alt: rest.name, hint: 'product photo' },
            { url: image3, alt: rest.name, hint: 'product photo' },
        ],
    };

    db.products[productIndex] = updatedProductData;
    await writeDb(db);

    revalidatePath(`/products/${id}`);
    revalidatePath('/products');
    revalidatePath('/admin/products');

    return { success: true, product: updatedProductData };
}

/**
 * Deletes a product from the database.
 */
export async function deleteProduct(productId: string) {
    const db = await readDb();
    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.id !== productId);
    
    if (db.products.length < initialLength) {
        await writeDb(db);
        revalidatePath('/products');
        revalidatePath('/admin/products');
        return { success: true };
    }
    return { success: false, message: 'Product not found.' };
}

// --- Review Management Functions ---

const refreshProductCalculations = (product: Product): Product => {
    if (product.detailedReviews && product.detailedReviews.length > 0) {
      const totalRating = product.detailedReviews.reduce((acc, review) => acc + review.rating, 0);
      const newAverage = totalRating / product.detailedReviews.length;
      return { ...product, rating: newAverage, reviews: product.detailedReviews.length };
    }
    return { ...product, rating: 0, reviews: 0 };
};

export async function addReview(productId: string, author: string, rating: number, comment: string) {
    const db = await readDb();
    const productIndex = db.products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        const newReview: Review = {
            id: new Date().getTime().toString(),
            author,
            rating,
            comment,
            date: new Date().toISOString(),
        };

        const productToUpdate = db.products[productIndex];
        productToUpdate.detailedReviews.unshift(newReview);
        db.products[productIndex] = refreshProductCalculations(productToUpdate);
        
        await writeDb(db);
        revalidatePath(`/products/${productId}`);
        return { success: true };
    }
    return { success: false, message: 'Product not found.' };
}

export async function updateReview(productId: string, reviewId: string, comment: string, rating: number) {
    const db = await readDb();
    const productIndex = db.products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        const productToUpdate = db.products[productIndex];
        const updatedReviews = productToUpdate.detailedReviews.map(r => 
            r.id === reviewId ? { ...r, comment, rating } : r
        );
        productToUpdate.detailedReviews = updatedReviews;
        db.products[productIndex] = refreshProductCalculations(productToUpdate);
        
        await writeDb(db);
        revalidatePath(`/products/${productId}`);
        revalidatePath('/admin/products');
        return { success: true };
    }
    return { success: false, message: 'Failed to update review.' };
}

export async function deleteReview(productId: string, reviewId: string) {
    const db = await readDb();
    const productIndex = db.products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        const productToUpdate = db.products[productIndex];
        const updatedReviews = productToUpdate.detailedReviews.filter(r => r.id !== reviewId);
        productToUpdate.detailedReviews = updatedReviews;
        db.products[productIndex] = refreshProductCalculations(productToUpdate);

        await writeDb(db);
        revalidatePath(`/products/${productId}`);
        revalidatePath('/admin/products');
        return { success: true };
    }
    return { success: false, message: 'Failed to delete review.' };
}


// --- Functions to get product data ---

export async function getProducts(): Promise<Product[]> {
    const db = await readDb();
    return db.products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const products = await getProducts();
    return products.find(p => p.id === id);
}
