
'use server';

import { revalidatePath } from 'next/cache';
import { 
    updateReview as dbUpdateReview, 
    deleteReview as dbDeleteReview 
} from '@/lib/products-db';

export async function updateReview(productId: string, reviewId: string, comment: string, rating: number) {
    const result = await dbUpdateReview(productId, reviewId, comment, rating);
    if(result) {
        revalidatePath(`/products/${productId}`);
        return { success: true };
    }
    return { success: false };
}

export async function deleteReview(productId: string, reviewId: string) {
    const result = await dbDeleteReview(productId, reviewId);
     if(result) {
        revalidatePath(`/products/${productId}`);
        return { success: true };
    }
    return { success: false };
}
