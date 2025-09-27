
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
  
  const refreshProductCalculations = (product: Product): Product => {
    if (product.detailedReviews && product.detailedReviews.length > 0) {
      const totalRating = product.detailedReviews.reduce((acc, review) => acc + review.rating, 0);
      const newAverage = totalRating / product.detailedReviews.length;
      return { ...product, rating: newAverage, reviews: product.detailedReviews.length };
    }
    return { ...product, rating: 0, reviews: 0 };
  };

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prevProducts => {
      const refreshedProduct = refreshProductCalculations(updatedProduct);
      return prevProducts.map(p => p.id === refreshedProduct.id ? refreshedProduct : p);
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
      purchaseLimit: newProductData.purchaseLimit || 10,
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
    setProducts(prevProducts => 
        prevProducts.map(p => {
            if (p.id === productId) {
                const updatedReviews = p.detailedReviews.map(r => 
                    r.id === reviewId ? { ...r, comment: newComment, rating: newRating } : r
                );
                const updatedProduct = { ...p, detailedReviews: updatedReviews };
                return refreshProductCalculations(updatedProduct);
            }
            return p;
        })
    );
     toast({
        title: "Review Updated",
        description: "The review has been successfully updated."
    });
  }, [toast]);

  const deleteReview = useCallback((productId: string, reviewId: string) => {
    setProducts(prevProducts => 
        prevProducts.map(p => {
            if (p.id === productId) {
                const updatedReviews = p.detailedReviews.filter(r => r.id !== reviewId);
                const updatedProduct = { ...p, detailedReviews: updatedReviews };
                return refreshProductCalculations(updatedProduct);
            }
            return p;
        })
    );
    toast({
        variant: 'destructive',
        title: "Review Deleted",
        description: "The review has been successfully removed."
    });
  }, [toast]);

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
