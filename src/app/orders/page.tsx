
'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Order } from '@/app/checkout/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MessageSquare, LogIn, ShoppingBag, CheckCircle, Clock, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


export default function OrdersPage() {
  const [displayOrders, setDisplayOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { isOwner, currentUser, isMounted: authIsMounted } = useAuth();
  const { toast } = useToast();

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
             <CardHeader className="flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                    <CardTitle className="text-xl">
                      <Link href={`/orders/${order.id}`} className="hover:underline">
                        Order #{order.id}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                        {isOwner && `${order.customer.firstName} ${order.customer.lastName} • `}
                        {format(new Date(order.date), "PPP p")}
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-4">
                     <p className="font-bold text-xl">Rs.{order.total.toFixed(2)}</p>
                      <div className={cn(
                        "flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                        order.status === 'confirmed' ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        )}>
                        {order.status === 'confirmed' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        {order.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                     </div>
                </div>
            </CardHeader>
            <CardContent>
              <div className='flex justify-between items-center'>
                  <p className='text-sm text-muted-foreground'>
                    {order.items.length} item(s) • Transaction ID: {order.transactionId}
                  </p>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/orders/${order.id}`}>
                      View Details <ArrowRight className='ml-2 h-4 w-4' />
                    </Link>
                  </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
