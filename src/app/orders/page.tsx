
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    // Sort orders from newest to oldest
    storedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setOrders(storedOrders);
  };
  
  const acceptOrder = (orderId: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, paymentStatus: 'Paid' as const };
      }
      return order;
    });
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  if (!isMounted) {
    return (
        <div className="container py-12 text-center">
            <p>Loading orders...</p>
        </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container py-12 text-center">
        <Card>
            <CardHeader>
                <CardTitle>No Orders Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">There are currently no orders to display.</p>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Customer Orders</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A list of all submitted orders.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {orders.map((order) => (
          <AccordionItem key={order.id} value={order.id}>
             <Card>
                <AccordionTrigger className="p-6 text-left">
                    <div className="flex-1">
                        <p className="font-bold text-lg">Order #{order.id.slice(-6)}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.firstName} {order.customer.lastName} &bull; {format(new Date(order.date), "PPP p")}</p>
                    </div>
                     <div className="flex items-center gap-4">
                        <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'secondary'} className={cn(order.paymentStatus === 'Paid' ? 'bg-green-600' : 'bg-orange-500', 'text-white')}>
                            {order.paymentStatus}
                        </Badge>
                        <p className="font-bold text-lg text-right">Rs.{order.total.toFixed(2)}</p>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
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
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {order.paymentStatus === 'Pending' && (
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
