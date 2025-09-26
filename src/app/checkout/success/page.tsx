
'use client';

import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, Phone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CheckoutSuccessContent() {
    const { clearCart } = useCart();
    const searchParams = useSearchParams();
    const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'verified' | 'idle'>('idle');
    
    // This effect simulates the server-side verification of the transaction
    useEffect(() => {
        const oid = searchParams.get('oid'); // eSewa passes back the order ID as 'oid'
        const refId = searchParams.get('refId'); // eSewa passes back a reference ID

        if (oid && refId) {
            setVerificationStatus('verifying');
            // Simulate an API call to our backend to verify the transaction with eSewa
            setTimeout(() => {
                console.log(`Verifying eSewa transaction: Order ID - ${oid}, Ref ID - ${refId}`);
                // In a real app, the backend would call eSewa's verification API.
                // If successful, we update the order status in our database from 'Pending' to 'Paid'.
                
                // For this simulation, we'll just proceed to the verified state.
                const orders = JSON.parse(localStorage.getItem('orders') || '[]') as any[];
                const updatedOrders = orders.map(o => o.id === oid ? { ...o, paymentStatus: 'Paid' } : o);
                localStorage.setItem('orders', JSON.stringify(updatedOrders));

                setVerificationStatus('verified');
            }, 2000); // Simulate network delay
        } else {
            setVerificationStatus('verified'); // No verification needed for non-eSewa payments
        }
    }, [searchParams]);


    useEffect(() => {
        if(verificationStatus === 'verified'){
            clearCart();
        }
    }, [verificationStatus, clearCart]);


    return (
        <div className="w-full max-w-lg">
            <Card className="text-center">
                <CardHeader>
                    {verificationStatus === 'verifying' && (
                        <>
                            <div className="mx-auto p-3">
                                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            </div>
                            <CardTitle className="mt-4 text-2xl">Verifying Payment...</CardTitle>
                            <CardDescription>Please wait while we confirm your transaction.</CardDescription>
                        </>
                    )}
                    {verificationStatus === 'verified' && (
                        <>
                             <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                            <CardTitle className="mt-4 text-2xl">Order Successful!</CardTitle>
                            <CardDescription>Thank you for your purchase.</CardDescription>
                        </>
                    )}
                </CardHeader>
                <CardContent>
                     {verificationStatus === 'verifying' ? (
                         <p className="text-muted-foreground">
                            This may take a moment. Do not close this page.
                         </p>
                     ) : (
                        <>
                            <p className="text-muted-foreground">
                            We've received and confirmed your order. A confirmation email has been sent to you with the order details.
                            </p>
                            <Button asChild className="mt-6">
                            <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </>
                     )}
                </CardContent>
            </Card>
             <Card className="mt-6">
                <CardHeader className="flex-row items-center gap-3">
                    <Phone className="h-6 w-6 text-muted-foreground" />
                    <CardTitle className="text-xl">Questions about your order?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        To confirm your order or for any inquiries, please contact our support team.
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

    