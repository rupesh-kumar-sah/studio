
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/cart-provider';
import { useAuth } from '@/components/auth/auth-provider';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, LogIn } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { OrderStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { isToday } from 'date-fns';
import { EsewaQrCode } from '@/components/checkout/esewa-qr-code';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';

export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  customer: z.infer<typeof customerInfoSchema>;
  transactionId: string;
  message?: string;
  status: OrderStatus;
  paymentMethod: 'eSewa' | 'Khalti';
};

const customerInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

const checkoutSchema = z.object({
  customer: customerInfoSchema,
  transactionId: z.string().min(1, 'Transaction ID is required'),
  message: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart, isCartMounted } = useCart();
  const { currentUser, isMounted: isAuthMounted, updateCustomerDetails } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
      },
      transactionId: '',
      message: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.setValue('customer.firstName', currentUser.name.split(' ')[0] || '');
      form.setValue('customer.lastName', currentUser.name.split(' ').slice(1).join(' ') || '');
      form.setValue('customer.email', currentUser.email);
      if(currentUser.phone) {
          form.setValue('customer.phone', currentUser.phone);
      }
    }
  }, [currentUser, form]);
  
   useEffect(() => {
    if (isCartMounted && totalItems === 0 && !isProcessing) {
      router.replace('/products');
    }
  }, [isCartMounted, totalItems, isProcessing, router]);


  const onSubmit = (data: CheckoutFormValues) => {
    setIsProcessing(true);
    
    // Logic is executed inside a timeout to simulate an API call,
    // so we can use localStorage without causing hydration issues.
    setTimeout(() => {
        const DAILY_PURCHASE_LIMIT = 100;
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
        const customerOrders = existingOrders.filter(o => o.customer.email === data.customer.email);
        
        const itemsPurchasedToday = customerOrders
          .filter(o => isToday(new Date(o.date)))
          .reduce((acc, order) => acc + order.items.reduce((sum, item) => sum + item.quantity, 0), 0);

        if (itemsPurchasedToday + totalItems > DAILY_PURCHASE_LIMIT) {
          toast({
            variant: 'destructive',
            title: 'Daily Limit Exceeded',
            description: `You can only purchase up to ${DAILY_PURCHASE_LIMIT} items per day. You have already purchased ${itemsPurchasedToday} items today.`,
          });
          setIsProcessing(false);
          return;
        }

        const orderId = `NEm-${Date.now().toString().slice(-6)}`;
        const newOrder: Order = {
            id: orderId,
            date: new Date().toISOString(),
            items: items,
            total: totalPrice,
            customer: data.customer,
            transactionId: data.transactionId,
            message: data.message,
            status: 'pending',
            paymentMethod: 'eSewa',
        };
        
        // Also update customer's phone number if it's new
        if (currentUser && currentUser.phone !== data.customer.phone) {
            updateCustomerDetails({ name: currentUser.name, phone: data.customer.phone });
        }
        
        const updatedOrders = [...existingOrders, newOrder];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));

        window.dispatchEvent(new CustomEvent('orders-updated'));
        window.dispatchEvent(new CustomEvent('new-order-alert', { detail: { orderId } }));

        clearCart();
        router.push(`/checkout/success?orderId=${orderId}`);
    }, 1500);
  };
  
  if (!isCartMounted || !isAuthMounted || (isCartMounted && totalItems === 0 && !isProcessing)) {
      return (
          <div className="container flex items-center justify-center py-20 text-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <p>Loading or redirecting...</p>
              </div>
          </div>
      );
  }
  
  if (!currentUser) {
    return (
        <>
        <Header />
        <div className="container flex flex-col items-center justify-center text-center py-20">
            <Card className="w-full max-w-md p-8">
                 <LogIn className="h-12 w-12 mx-auto text-muted-foreground" />
                <h1 className="text-2xl font-bold mt-4">Please Log In</h1>
                <p className="mt-2 text-muted-foreground">You need to be logged in to proceed to checkout.</p>
                <Button asChild className="mt-6">
                    <Link href="/login">Go to Login</Link>
                </Button>
            </Card>
        </div>
        <Footer />
        </>
    )
  }

  return (
    <>
    <Header />
    <div className="container py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
            <p className="mt-2 text-lg text-muted-foreground">Complete your order by providing the details below.</p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-2 lg:gap-12">
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="customer.firstName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="customer.lastName" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                             <div className="grid sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="customer.email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input type="email" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="customer.phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl><Input type="tel" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="customer.address" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField control={form.control} name="customer.city" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="customer.postalCode" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pay with eSewa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EsewaQrCode />
                        </CardContent>
                    </Card>


                    <Card>
                         <CardHeader>
                            <CardTitle>Confirm Payment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="transactionId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transaction ID (Payment Code)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your transaction ID" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Order Notes (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Notes about your order, e.g. special delivery instructions."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:sticky lg:top-24 h-fit">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ScrollArea className="h-64 pr-4">
                                <div className="space-y-4">
                                    {items.map(item => (
                                        <div key={item.cartItemId} className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                                <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" sizes="64px" />
                                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-sm text-muted-foreground">{item.size} / {item.color}</p>
                                            </div>
                                            <p className="font-medium">Rs.{(item.product.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Subtotal</p>
                                    <p>Rs.{totalPrice.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Shipping</p>
                                    <p>Free</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <p>Total</p>
                                <p>Rs.{totalPrice.toFixed(2)}</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                           <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm Payment & Place Order'
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                        By placing your order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </form>
        </Form>
    </div>
    <Footer />
    </>
  );
}

    