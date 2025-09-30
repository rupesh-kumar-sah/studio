
'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Order } from '@/app/checkout/page';
import { OrdersPageClient } from './_components/orders-client-page';
import { Loader2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const loadOrders = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
      storedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAllOrders(storedOrders);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    loadOrders();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'orders') {
        loadOrders();
      }
    };
    
    const handleCustomOrderUpdate = () => {
        loadOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orders-updated', handleCustomOrderUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orders-updated', handleCustomOrderUpdate);
    };
  }, [loadOrders]);

  if (!isMounted) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Customer Orders</h1>
        <p className="text-muted-foreground">Manage and view all submitted orders.</p>
      </div>
      <OrdersPageClient initialOrders={allOrders} />
    </div>
  );
}
