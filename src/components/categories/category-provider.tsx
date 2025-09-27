
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const initialCategories: Category[] = ['Clothing', 'Shoes', 'Accessories', 'Electronics'];

interface CategoryContextType {
  categories: Category[];
  addCategory: (category: Category) => boolean;
  editCategory: (oldName: string, newName: string) => boolean;
  deleteCategory: (categoryName: string) => void;
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
            const parsed = JSON.parse(storedCategories);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCategories(parsed);
            } else {
              localStorage.setItem('categories', JSON.stringify(initialCategories));
              setCategories(initialCategories);
            }
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
  
  const editCategory = useCallback((oldName: string, newName: string) => {
     if (categories.find(c => c.toLowerCase() === newName.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase())) {
        toast({
            variant: 'destructive',
            title: 'Category exists',
            description: `The category "${newName}" already exists.`,
        });
        return false;
    }
    setCategories(prev => prev.map(c => (c === oldName ? newName : c)));
    toast({
        title: 'Category Updated',
        description: `Category "${oldName}" has been updated to "${newName}".`,
    });
    return true;
  }, [categories, toast]);

  const deleteCategory = useCallback((categoryName: string) => {
    setCategories(prev => prev.filter(c => c !== categoryName));
    toast({
        variant: 'destructive',
        title: 'Category Deleted',
        description: `Category "${categoryName}" has been deleted.`,
    });
  }, [toast]);


  const value = { categories, addCategory, editCategory, deleteCategory };

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
