
'use client';

import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users } from "lucide-react";
import type { Order } from "../checkout/page";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
    const { allUsers } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
        setOrders(storedOrders);

        const handleStorageChange = () => {
            const updatedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
            setOrders(updatedOrders);
        }
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('orders-updated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('orders-updated', handleStorageChange);
        }
    }, []);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalCustomers = allUsers.filter(u => u.email !== "rsah0123456@gmail.com").length;

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Rupesh! Here's an overview of your store.</p>
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
              From all successful orders.
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
