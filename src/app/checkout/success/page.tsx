
'use client';

import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Phone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import type { Order } from '@/app/checkout/page';
import { useSearchParams } from 'next/navigation';


function CheckoutSuccessContent() {
    const { clearCart } = useCart();
    const [order, setOrder] = useState<Order | null>(null);
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (!orderId) return;

        const findOrder = () => {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
            const foundOrder = orders.find(o => o.id === orderId);
            setOrder(foundOrder || null);
            
            // Only clear cart if the order is confirmed
            if (foundOrder?.status === 'confirmed') {
                clearCart();
            }
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

    }, [orderId, clearCart]);

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
                            <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                            <p className='mt-2 text-muted-foreground'>
                                You will be notified once payment is confirmed. You can check your order status on the orders page.
                            </p>
                        </div>
                        <Button asChild className="mt-6">
                            <Link href="/products">Continue Shopping</Link>
                        </Button>
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
                        <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                         <p className='mt-2 text-muted-foreground'>
                            You can view your order details on the orders page.
                        </p>
                    </div>
                    <Button asChild className="mt-6">
                    <Link href="/products">Continue Shopping</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="mt-6">
                <CardHeader className="flex-row items-center gap-3">
                    <Phone className="h-6 w-6 text-muted-foreground" />
                    <CardTitle className="text-xl">Questions about your order?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        For any inquiries, please contact our support team at 9824812753.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}


export default function OrderSuccessPage() {
  return (
    <div className="container flex items-center justify-center py-20">
       <Suspense fallback={<div>Loading...</div>}>
            <CheckoutSuccessContent />
       </Suspense>
    </div>
  );
}
