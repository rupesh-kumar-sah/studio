
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { products as initialProducts } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

interface ProductContextType {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
  deleteProduct: (productId: string) => void;
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
            // If nothing in storage, initialize it with the default products
            localStorage.setItem('products', JSON.stringify(initialProducts));
            setProducts(initialProducts);
        }
    } catch (error) {
        console.error("Failed to parse products from localStorage", error);
        // Fallback to initial products if localStorage is corrupt
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
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    toast({
        title: "Product Updated",
        description: `${updatedProduct.name} has been successfully updated.`
    });
  }, [toast]);
  
  const addProduct = useCallback((newProductData: Omit<Product, 'id' | 'rating' | 'reviews'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: new Date().getTime().toString(), // Simple unique ID
      rating: 0,
      reviews: 0,
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

  const value = { products, getProductById, updateProduct, addProduct, deleteProduct };

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
