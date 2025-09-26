"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if(isMounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addItem = (product: Product, size: string, color: string) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      } else {
        return [...prevItems, { product, quantity: 1, size, color }];
      }
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeItem = (productId: string, size: string, color: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product.id === productId && item.size === size && item.color === color)
      )
    );
  };
  
  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
     if (quantity < 1) {
        removeItem(productId, size, color);
        return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return { totalItems, totalPrice };
  }, [items]);
  
  const value = { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
