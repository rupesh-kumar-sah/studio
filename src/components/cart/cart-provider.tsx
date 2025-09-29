
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, size: string, color: string) => number;
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
  
  const getItemQuantity = useCallback((productId: string, size: string, color: string) => {
    const cartItemId = `${productId}-${size}-${color}`;
    const existingItem = items.find(
      (item) => item.cartItemId === cartItemId
    );
    return existingItem ? existingItem.quantity : 0;
  }, [items]);

  const addItem = useCallback((product: Product, size: string, color: string) => {
    setItems((prevItems) => {
      const cartItemId = `${product.id}-${size}-${color}`;
      const existingItemIndex = prevItems.findIndex(
        (item) => item.cartItemId === cartItemId
      );
      
      const stockLimit = product.stock;
      const purchaseLimit = product.purchaseLimit || 10;

      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        const currentItem = newItems[existingItemIndex];
        const newQuantity = currentItem.quantity + 1;

        if (newQuantity > stockLimit) {
            setTimeout(() => {
              toast({
                  variant: 'destructive',
                  title: "Stock Limit Reached",
                  description: `You cannot add more of ${product.name} to the cart.`,
              });
            }, 0);
            return prevItems;
        }
        if (newQuantity > purchaseLimit) {
           setTimeout(() => {
              toast({
                variant: 'destructive',
                title: 'Purchase Limit Exceeded',
                description: `You can only purchase up to ${purchaseLimit} units.`,
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
        if (1 > stockLimit) {
            setTimeout(() => {
              toast({
                  variant: 'destructive',
                  title: "Out of Stock",
                  description: `${product.name} is currently out of stock.`,
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
        return [...prevItems, { cartItemId, product, quantity: 1, size, color }];
      }
    });
  }, [toast]);

  const removeItem = (cartItemId: string) => {
    setItems((prevItems) =>
      prevItems.filter(item => item.cartItemId !== cartItemId)
    );
  };
  
  const updateQuantity = (cartItemId: string, quantity: number) => {
     const itemToUpdate = items.find(item => item.cartItemId === cartItemId);
     if (!itemToUpdate) return;
     
     const stockLimit = itemToUpdate.product.stock;
     const purchaseLimit = itemToUpdate.product.purchaseLimit || 10;
     const limit = Math.min(stockLimit, purchaseLimit);

     if (quantity > limit) {
        setTimeout(() => {
          toast({
              variant: 'destructive',
              title: "Limit Reached",
              description: `You can only add up to ${limit} units of ${itemToUpdate.product.name}.`,
          });
        }, 0);
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.cartItemId === cartItemId
                ? { ...item, quantity: limit }
                : item
            )
        );
        return;
    }

     if (quantity < 1) {
        removeItem(cartItemId);
        return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId
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
  
  const value = { items, addItem, removeItem, updateQuantity, clearCart, getItemQuantity, totalItems, totalPrice, isCartMounted };

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
