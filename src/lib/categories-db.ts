
'use server';

import type { Category } from './types';

// Mock database for categories
let categories: Category[] = ['Men', 'Women', 'Junior', 'Electronics', 'Fashion'];

export async function getCategories(): Promise<Category[]> {
  // In a real app, you'd fetch this from a database
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
