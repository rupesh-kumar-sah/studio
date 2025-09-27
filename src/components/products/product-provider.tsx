
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { initialProducts } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

interface ProductContextType {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  updateProduct: (updatedProduct: Product) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        } else {
            // If nothing in storage, initialize it with the default products
            localStorage.setItem('products', JSON.stringify(initialProducts));
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

  const value = { products, getProductById, updateProduct };

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
