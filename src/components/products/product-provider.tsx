
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, Review } from '@/lib/types';
import { products as initialProducts } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

interface ProductContextType {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Omit<Product, 'id' | 'rating' | 'reviews' | 'detailedReviews'>) => void;
  deleteProduct: (productId: string) => void;
  updateReview: (productId: string, reviewId: string, newComment: string, newRating: number) => void;
  deleteReview: (productId: string, reviewId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let storedProducts;
    try {
        storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        } else {
            localStorage.setItem('products', JSON.stringify(initialProducts));
            setProducts(initialProducts);
        }
    } catch (error) {
        console.error("Failed to parse products from localStorage", error);
        setProducts(initialProducts);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, isMounted]);

  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prevProducts => {
      const newProducts = prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      return newProducts.map(p => {
        if (p.detailedReviews && p.detailedReviews.length > 0) {
          const totalRating = p.detailedReviews.reduce((acc, review) => acc + review.rating, 0);
          const newAverage = totalRating / p.detailedReviews.length;
          return { ...p, rating: newAverage, reviews: p.detailedReviews.length };
        }
        return p;
      });
    });
    toast({
        title: "Product Updated",
        description: `${updatedProduct.name} has been successfully updated.`
    });
  }, [toast]);
  
  const addProduct = useCallback((newProductData: Omit<Product, 'id' | 'rating' | 'reviews' | 'detailedReviews'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: new Date().getTime().toString(), // Simple unique ID
      rating: 0,
      reviews: 0,
      detailedReviews: [],
    };
    setProducts(prevProducts => [newProduct, ...prevProducts]);
    toast({
        title: "Product Added",
        description: `${newProduct.name} has been successfully added.`
    });
  }, [toast]);

  const deleteProduct = useCallback((productId: string) => {
    const productName = products.find(p => p.id === productId)?.name || 'Product';
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    toast({
        variant: 'destructive',
        title: "Product Deleted",
        description: `${productName} has been removed.`
    });
  }, [products, toast]);

  const updateReview = useCallback((productId: string, reviewId: string, newComment: string, newRating: number) => {
    setProducts(prevProducts => {
        const newProducts = prevProducts.map(p => {
            if (p.id === productId) {
                const updatedReviews = p.detailedReviews.map(r => 
                    r.id === reviewId ? { ...r, comment: newComment, rating: newRating } : r
                );
                return { ...p, detailedReviews: updatedReviews };
            }
            return p;
        });
        const productToUpdate = newProducts.find(p => p.id === productId);
        if (productToUpdate) {
            updateProduct(productToUpdate);
        }
        return newProducts;
    });
     toast({
        title: "Review Updated",
        description: "The review has been successfully updated."
    });
  }, [updateProduct, toast]);

  const deleteReview = useCallback((productId: string, reviewId: string) => {
    setProducts(prevProducts => {
        const newProducts = prevProducts.map(p => {
            if (p.id === productId) {
                const updatedReviews = p.detailedReviews.filter(r => r.id !== reviewId);
                return { ...p, detailedReviews: updatedReviews };
            }
            return p;
        });
        const productToUpdate = newProducts.find(p => p.id === productId);
        if (productToUpdate) {
            updateProduct(productToUpdate);
        }
        return newProducts;
    });
    toast({
        variant: 'destructive',
        title: "Review Deleted",
        description: "The review has been successfully removed."
    });
  }, [updateProduct, toast]);

  const value = { products, getProductById, updateProduct, addProduct, deleteProduct, updateReview, deleteReview };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
