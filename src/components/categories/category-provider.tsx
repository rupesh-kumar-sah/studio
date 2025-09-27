
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const initialCategories: Category[] = ['Clothing', 'Shoes', 'Accessories'];

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Category) => boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
        const storedCategories = localStorage.getItem('categories');
        if (storedCategories) {
            setCategories(JSON.parse(storedCategories));
        } else {
            localStorage.setItem('categories', JSON.stringify(initialCategories));
            setCategories(initialCategories);
        }
    } catch (error) {
        console.error("Failed to parse categories from localStorage", error);
        setCategories(initialCategories);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('categories', JSON.stringify(categories));
    }
  }, [categories, isMounted]);

  const addCategory = useCallback((category: Category) => {
    if (categories.find(c => c.toLowerCase() === category.toLowerCase())) {
        toast({
            variant: 'destructive',
            title: 'Category exists',
            description: `The category "${category}" already exists.`,
        });
        return false;
    }
    setCategories(prevCategories => [...prevCategories, category]);
    toast({
        title: 'Category Added',
        description: `Category "${category}" has been added.`,
    });
    return true;
  }, [categories, toast]);


  const value = { categories, addCategory };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
