
'use server';

import type { Category } from './types';

// Mock database for categories. This should align with the initial state in the provider.
let categories: Category[] = ['Clothing', 'Shoes', 'Accessories', 'Electronics'];

export async function getCategories(): Promise<Category[]> {
  // In a real app, you'd fetch this from a database.
  // For the prototype, we check localStorage first, then fall back to the mock array.
  // Note: This server function cannot access localStorage directly. The client-side
  // CategoryProvider is the primary source of truth. This is a simplified representation.
  return Promise.resolve(categories);
}

export async function addCategory(category: Category): Promise<{ success: boolean; message?: string }> {
  if (categories.find(c => c.toLowerCase() === category.toLowerCase())) {
    return { success: false, message: `Category "${category}" already exists.` };
  }
  categories.push(category);
  // In a real app, you'd save this to a database
  return { success: true };
}
