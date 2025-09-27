
'use client';

import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Phone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import type { Order } from '@/app/checkout/page';


function CheckoutSuccessContent() {
    const { clearCart } = useCart();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
        if (orders.length > 0) {
            const mostRecentOrder = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            setOrder(mostRecentOrder);
        }
        clearCart();
    }, [clearCart]);

    const isPending = order?.paymentStatus === 'Pending';
    
    const formatPaymentMethod = (method: 'esewa' | 'khalti') => {
        if (method === 'esewa') return 'eSewa';
        if (method === 'khalti') return 'Khalti';
        return method;
    }

    return (
        <div className="w-full max-w-lg">
            <Card className="text-center">
                <CardHeader>
                     <div className={`mx-auto rounded-full p-3 w-fit ${isPending ? 'bg-orange-100' : 'bg-green-100'}`}>
                        {isPending ? (
                             <Clock className="h-12 w-12 text-orange-600" />
                        ) : (
                             <CheckCircle2 className="h-12 w-12 text-green-600" />
                        )}
                    </div>
                    <CardTitle className="mt-4 text-2xl">
                        {isPending ? "Order Submitted for Review" : "Order Placed Successfully!"}
                    </CardTitle>
                    <CardDescription>
                         {isPending 
                            ? "Your order is awaiting payment confirmation."
                            : "Thank you for your purchase."
                         }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {order ? (
                        <div className='text-sm text-left bg-secondary p-4 rounded-md'>
                            <p className='font-semibold mb-2'>Order Summary:</p>
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Total:</strong> Rs.{order.total.toFixed(2)}</p>
                            <p><strong>Payment Method:</strong> {formatPaymentMethod(order.paymentMethod)}</p>
                             <p className='mt-2 text-muted-foreground'>
                                {isPending
                                    ? "We will notify you once the payment is accepted. You can check the status on the orders page."
                                    : "A confirmation email has been sent. You can view your order status on the orders page."
                                }
                            </p>
                        </div>
                    ) : (
                         <p className="text-muted-foreground">
                            Loading order details...
                        </p>
                    )}
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
                        To confirm your order or for any inquiries, please contact our support team at 9824812753.
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
