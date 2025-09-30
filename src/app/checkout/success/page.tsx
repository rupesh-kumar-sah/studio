
'use client';

import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import type { Order } from '@/app/checkout/page';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';


function CheckoutSuccessContent() {
    const [order, setOrder] = useState<Order | null>(null);
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (!orderId) return;

        const findOrder = () => {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
            const foundOrder = orders.find(o => o.id === orderId);
            setOrder(foundOrder || null);
        };

        findOrder();

        const handleStorageChange = (event: StorageEvent) => {
          if (event.key === 'orders') {
            findOrder();
          }
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('orders-updated', findOrder);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('orders-updated', findOrder);
        }

    }, [orderId]);

    const handleMessageAboutOrder = () => {
        if (order) {
            const message = `I have a question about my order #${order.id} (Transaction ID: ${order.transactionId}).`;
            const event = new CustomEvent('prefill-chat-message', { detail: { message } });
            window.dispatchEvent(event);
        }
    };

    if (!order) {
        return (
            <div className="text-center text-muted-foreground">
                <p>Loading order details...</p>
            </div>
        )
    }

    if (order.status === 'pending') {
        return (
            <div className="w-full max-w-lg">
                <Card className="text-center">
                    <CardHeader>
                        <div className="mx-auto rounded-full p-3 w-fit bg-amber-100">
                            <Clock className="h-12 w-12 text-amber-600" />
                        </div>
                        <CardTitle className="mt-4 text-2xl">
                            Order Pending Verification
                        </CardTitle>
                        <CardDescription>
                            Thank you for your purchase. We are now verifying your payment.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='text-sm text-left bg-secondary p-4 rounded-md'>
                            <p className='font-semibold mb-2'>Order Summary:</p>
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Total:</strong> Rs.{order.total.toFixed(2)}</p>
                            <p><strong>Transaction ID (Payment Code):</strong> {order.transactionId}</p>
                            <p className='mt-2 text-muted-foreground'>
                                You will be notified once payment is confirmed. You can check your order status on the orders page.
                            </p>
                        </div>
                         <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild>
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                             <Button variant="outline" onClick={handleMessageAboutOrder}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message about this order
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg">
            <Card className="text-center">
                <CardHeader>
                     <div className="mx-auto rounded-full p-3 w-fit bg-green-100">
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="mt-4 text-2xl">
                        Order Placed Successfully!
                    </CardTitle>
                    <CardDescription>
                        Your payment has been confirmed. Thank you for your purchase!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='text-sm text-left bg-secondary p-4 rounded-md'>
                        <p className='font-semibold mb-2'>Order Summary:</p>
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p><strong>Total:</strong> Rs.{order.total.toFixed(2)}</p>
                        <p><strong>Transaction ID (Payment Code):</strong> {order.transactionId}</p>
                         <p className='mt-2 text-muted-foreground'>
                            You can view your order details on the orders page.
                        </p>
                    </div>
                     <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
                         <Button variant="outline" onClick={handleMessageAboutOrder}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message about this order
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


export default function OrderSuccessPage() {
  return (
    <>
    <Header />
    <div className="container flex items-center justify-center py-20">
       <Suspense fallback={<div>Loading...</div>}>
            <CheckoutSuccessContent />
       </Suspense>
    </div>
    <Footer />
    </>
  );
}
