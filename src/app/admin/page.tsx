
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Loader2 } from "lucide-react";
import type { Order } from "../checkout/page";
import type { User } from '@/lib/types';
import { useAuth } from '@/components/auth/auth-provider';

export default function AdminDashboardPage() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { allUsers } = useAuth();

  useEffect(() => {
    // Functions to safely get data from localStorage
    const getOrders = (): Order[] => {
      try {
        const storedOrders = localStorage.getItem('orders');
        return storedOrders ? JSON.parse(storedOrders) : [];
      } catch (e) {
        return [];
      }
    };

    const orders = getOrders();
    const confirmedOrders = orders.filter(o => o.status === 'confirmed');
    
    const revenue = confirmedOrders.reduce((sum, order) => sum + order.total, 0);
    setTotalRevenue(revenue);
    setTotalOrders(orders.length);
    setTotalCustomers(allUsers.length);
    setIsLoading(false);
    
     const handleOrdersUpdate = () => {
        const updatedOrders = getOrders();
        const updatedConfirmedOrders = updatedOrders.filter(o => o.status === 'confirmed');
        const updatedRevenue = updatedConfirmedOrders.reduce((sum, order) => sum + order.total, 0);
        setTotalRevenue(updatedRevenue);
        setTotalOrders(updatedOrders.length);
    };
    
     window.addEventListener('orders-updated', handleOrdersUpdate);
     
     return () => {
        window.removeEventListener('orders-updated', handleOrdersUpdate);
     }

  }, [allUsers]);
  
   useEffect(() => {
    // allUsers comes from a provider, so we can react to its changes
    setTotalCustomers(allUsers.length);
  }, [allUsers]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your store.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NPR {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From all confirmed orders.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total orders placed.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Total registered users.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
