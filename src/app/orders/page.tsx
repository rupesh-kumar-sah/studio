
'use client';

import { useEffect, useState } from 'react';
import type { Order } from '@/app/checkout/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageSquare, LogIn, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import Link from 'next/link';

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [displayOrders, setDisplayOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { isOwner, currentUser, isMounted: authIsMounted } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    if (authIsMounted) {
        loadAndFilterOrders();
    }
  }, [authIsMounted, currentUser, isOwner]);

  const loadAndFilterOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    storedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setAllOrders(storedOrders);

    if (isOwner) {
        setDisplayOrders(storedOrders);
    } else if (currentUser) {
        const customerOrders = storedOrders.filter(order => order.customer.email === currentUser.email);
        setDisplayOrders(customerOrders);
    } else {
        setDisplayOrders([]);
    }
  };
  
  const acceptOrder = (orderId: string) => {
    const updatedOrders = allOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, paymentStatus: 'Accepted' as const };
      }
      return order;
    });
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    loadAndFilterOrders(); // Reload and re-filter to update the state
  };

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
      <Accordion type="single" collapsible className="w-full space-y-4">
        {displayOrders.map((order) => (
          <AccordionItem key={order.id} value={order.id}>
             <Card>
                <AccordionTrigger className="p-6 text-left">
                    <div className="flex-1">
                        <p className="font-bold text-lg">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.firstName} {order.customer.lastName} &bull; {format(new Date(order.date), "PPP p")}</p>
                    </div>
                     <div className="flex items-center gap-4">
                        {order.message && <MessageSquare className="text-primary" />}
                        <Badge variant={order.paymentStatus === 'Accepted' ? 'default' : 'secondary'} className={cn(order.paymentStatus === 'Accepted' ? 'bg-green-600' : 'bg-orange-500', 'text-white')}>
                            {order.paymentStatus}
                        </Badge>
                        <p className="font-bold text-lg text-right">Rs.{order.total.toFixed(2)}</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                    {order.message && (
                        <div className="mb-6 p-4 bg-secondary rounded-lg">
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
                                <p>{order.customer.firstName} {order.customer.lastName}</p>
                                <p>{order.customer.email}</p>
                                <p>{order.customer.address}</p>
                                <p>{order.customer.city}, {order.customer.postalCode}</p>
                            </div>
                            <h3 className="font-semibold mt-4 mb-2">Payment</h3>
                             <div className="text-sm text-muted-foreground">
                                <p>Method: <span className="font-medium uppercase">{order.paymentMethod}</span></p>
                                <p>Status: <span className="font-medium">{order.paymentStatus}</span></p>
                                {order.walletId && <p>Wallet ID: {order.walletId}</p>}
                            </div>
                        </div>
                        <div>
                             <h3 className="font-semibold mb-2">Items</h3>
                              <div className="space-y-2">
                                {order.items.map(item => (
                                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center gap-4">
                                         <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                           <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity} &bull; Rs.{item.product.price.toFixed(2)}</p>
                                            <p className="text-sm text-muted-foreground">Size: {item.size} &bull; Color: {item.color}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {isOwner && order.paymentStatus === 'Pending' && (
                        <CardFooter className="pt-6">
                            <Button onClick={() => acceptOrder(order.id)}>Accept Order</Button>
                        </CardFooter>
                    )}
                </AccordionContent>
             </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
