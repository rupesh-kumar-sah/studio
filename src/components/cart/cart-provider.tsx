
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
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
  isCartMounted: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [isCartMounted, setIsCartMounted] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      // If parsing fails, clear the corrupt cart data
      localStorage.removeItem('cart');
    } finally {
      setIsCartMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isCartMounted) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isCartMounted]);

  const addItem = useCallback((product: Product, size: string, color: string) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      );
      
      const purchaseLimit = product.purchaseLimit || 10;

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        const newQuantity = newItems[existingItemIndex].quantity + 1;
        if (newQuantity > purchaseLimit) {
            setTimeout(() => {
              toast({
                  variant: 'destructive',
                  title: "Purchase Limit Reached",
                  description: `You can only purchase up to ${purchaseLimit} units of ${product.name}.`,
              });
            }, 0);
            return prevItems;
        }
        newItems[existingItemIndex].quantity = newQuantity;
        setTimeout(() => {
          toast({
              title: "Added to cart",
              description: `${product.name} has been added to your cart.`,
          });
        }, 0);
        return newItems;
      } else {
        if (1 > purchaseLimit) {
            setTimeout(() => {
              toast({
                  variant: 'destructive',
                  title: "Purchase Limit Reached",
                  description: `You can only purchase up to ${purchaseLimit} units of ${product.name}.`,
              });
            }, 0);
            return prevItems;
        }
        setTimeout(() => {
          toast({
              title: "Added to cart",
              description: `${product.name} has been added to your cart.`,
          });
        }, 0);
        return [...prevItems, { product, quantity: 1, size, color }];
      }
    });
  }, [toast]);

  const removeItem = (productId: string, size: string, color: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product.id === productId && item.size === size && item.color === color)
      )
    );
  };
  
  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
     const itemToUpdate = items.find(item => item.product.id === productId && item.size === size && item.color === color);
     const purchaseLimit = itemToUpdate?.product.purchaseLimit || 10;

     if (quantity > purchaseLimit) {
        setTimeout(() => {
          toast({
              variant: 'destructive',
              title: "Purchase Limit Reached",
              description: `You can only purchase up to ${purchaseLimit} units of ${itemToUpdate?.product.name}.`,
          });
        }, 0);
        return;
    }

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

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return { totalItems, totalPrice };
  }, [items]);
  
  const value = { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartMounted };

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
