
'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Order } from '@/app/checkout/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageSquare, LogIn, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import type { User } from '@/lib/types';

export default function OrdersPage() {
  const [displayOrders, setDisplayOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { isOwner, currentUser, isMounted: authIsMounted } = useAuth();

  const loadAndFilterOrders = useCallback(() => {
    if (typeof window === 'undefined') return;

    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    storedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (isOwner) {
        setDisplayOrders(storedOrders);
    } else if (currentUser) {
        const customerOrders = storedOrders.filter(order => order.customer.email === currentUser.email);
        setDisplayOrders(customerOrders);
    } else {
        setDisplayOrders([]);
    }
  }, [isOwner, currentUser]);


  useEffect(() => {
    setIsMounted(true);
    if (authIsMounted) {
        loadAndFilterOrders();
    }
  }, [authIsMounted, loadAndFilterOrders]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'orders') {
        loadAndFilterOrders();
      }
    };
    
    const handleCustomOrderUpdate = () => {
        loadAndFilterOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orders-updated', handleCustomOrderUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orders-updated', handleCustomOrderUpdate);
    };
  }, [loadAndFilterOrders]); 
  
  const acceptOrder = (orderId: string) => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    const updatedOrders = allOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, paymentStatus: 'Accepted' as const };
      }
      return order;
    });
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Dispatch custom event to notify all components including the current tab
    window.dispatchEvent(new CustomEvent('orders-updated'));
    
    // Also call directly to ensure immediate update in the current component
    loadAndFilterOrders();
  };

  const formatPaymentMethod = (method: 'esewa' | 'khalti') => {
      if (method === 'esewa') return 'eSewa';
      if (method === 'khalti') return 'Khalti';
      return method;
  }

  if (!isMounted || !authIsMounted) {
    return (
        <div className="container py-12 text-center">
            <p>Loading orders...</p>
        </div>
    );
  }

  if (!isOwner && !currentUser) {
     return (
        <div className="container flex flex-col items-center justify-center text-center py-20">
            <Card className="w-full max-w-md p-8">
                 <LogIn className="h-12 w-12 mx-auto text-muted-foreground" />
                <h1 className="text-2xl font-bold mt-4">Please Log In</h1>
                <p className="mt-2 text-muted-foreground">You need to be logged in to view your orders.</p>
                <Button asChild className="mt-6">
                    <Link href="/login">Go to Login</Link>
                </Button>
            </Card>
        </div>
    )
  }

  if (displayOrders.length === 0) {
    return (
      <div className="container py-12 text-center">
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
                <CardTitle className="mt-4">No Orders Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{currentUser ? "You haven't placed any orders yet." : "There are currently no orders to display."}</p>
                {currentUser && (
                    <Button asChild className="mt-6">
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                )}
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{isOwner ? "Customer Orders" : "My Orders"}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {isOwner ? "A list of all submitted orders." : "A list of your past orders."}
        </p>
      </div>
      <div className="space-y-6">
        {displayOrders.map((order) => (
          <Card key={order.id}>
             <CardHeader className="flex-row justify-between items-start">
                <div>
                    <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                    <CardDescription>
                        {order.customer.firstName} {order.customer.lastName} &bull; {format(new Date(order.date), "PPP p")}
                    </CardDescription>
                </div>
                 <div className="text-right">
                     <p className="font-bold text-xl">Rs.{order.total.toFixed(2)}</p>
                    <Badge className={cn(
                        'mt-1 text-white',
                        order.paymentStatus === 'Accepted' ? 'bg-green-600' : 'bg-orange-500'
                    )}>
                        {order.paymentStatus}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <Separator />
                {order.message && (
                    <div className="p-4 bg-secondary rounded-lg">
                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <MessageSquare className="h-5 w-5" />
                            Customer Message
                        </h4>
                        <p className="text-muted-foreground text-sm">{order.message}</p>
                    </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-2">Shipping Details</h3>
                        <div className="text-sm text-muted-foreground">
                            <p><strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}</p>
                            <p><strong>Email:</strong> {order.customer.email}</p>
                            <p><strong>Address:</strong> {order.customer.address}</p>
                            <p>{order.customer.city}, {order.customer.postalCode}</p>
                        </div>
                        <h3 className="font-semibold mt-4 mb-2">Payment</h3>
                         <div className="text-sm text-muted-foreground">
                            <p><strong>Method:</strong> <span className="font-medium">{formatPaymentMethod(order.paymentMethod)}</span></p>
                            <p><strong>Status:</strong> <span className="font-medium">{order.paymentStatus}</span></p>
                            {order.walletId && <p><strong>Wallet ID:</strong> {order.walletId}</p>}
                        </div>
                    </div>
                    <div>
                         <h3 className="font-semibold mb-2">Items ({order.items.length})</h3>
                          <div className="space-y-3">
                            {order.items.map(item => (
                                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center gap-4">
                                     <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                       <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        <p className="text-sm text-muted-foreground">Size: {item.size}, Color: {item.color}</p>
                                    </div>
                                    <p className="text-sm font-medium">Rs.{(item.product.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
            {isOwner && order.paymentStatus === 'Pending' && (
                <CardFooter>
                    <Button onClick={() => acceptOrder(order.id)}>Accept Order</Button>
                </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

    