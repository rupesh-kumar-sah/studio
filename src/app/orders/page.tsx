
'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Order } from '@/app/checkout/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MessageSquare, LogIn, ShoppingBag, CheckCircle, Clock, Trash2 } from 'lucide-react';
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

  const acceptOrder = (orderId: string) => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    const updatedOrders = storedOrders.map(order => 
        order.id === orderId ? { ...order, status: 'confirmed' } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    window.dispatchEvent(new CustomEvent('orders-updated'));
    toast({
        title: "Order Confirmed",
        description: `Order #${orderId} has been marked as confirmed.`
    });
  };

  const deleteOrder = (orderId: string) => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    const updatedOrders = storedOrders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    window.dispatchEvent(new CustomEvent('orders-updated'));
    toast({
        variant: 'destructive',
        title: "Order Deleted",
        description: `Order #${orderId} has been successfully deleted.`
    });
  };

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
                    <CardTitle className="text-xl">Order #{order.id}</CardTitle>
                    <CardDescription>
                        {order.customer.firstName} {order.customer.lastName} &bull; {format(new Date(order.date), "PPP p")}
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
                    </div>
                    <div>
                         <h3 className="font-semibold mb-2">Payment Details</h3>
                        <div className="text-sm text-muted-foreground">
                            <p><strong>Method:</strong> eSewa (Manual)</p>
                            <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                            <p><strong>Status:</strong> <span className={cn("font-medium", order.status === 'confirmed' ? 'text-green-600' : 'text-amber-600')}>{order.status === 'confirmed' ? 'Payment Confirmed' : 'Pending Verification'}</span></p>
                        </div>
                    </div>
                </div>
                 <Separator />
                <div>
                    <h3 className="font-semibold mb-4">Items ({order.items.length})</h3>
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
            </CardContent>
            {isOwner && (
                <CardFooter className="gap-2">
                    {order.status === 'pending' && (
                        <Button onClick={() => acceptOrder(order.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept Order
                        </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                           <Trash2 className="mr-2 h-4 w-4" />
                           Delete Order
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the order and all its data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteOrder(order.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

    