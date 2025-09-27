
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ShoppingBag, Loader2 } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';


// Define a union type for payment status
export type PaymentStatus = 'Pending' | 'Accepted' | 'Failed';

export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  customer: z.infer<typeof customerInfoSchema>;
  paymentMethod: 'esewa' | 'khalti';
  walletId?: string;
  message?: string;
  paymentStatus: PaymentStatus;
};

const customerInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

const checkoutSchema = z.object({
  customer: customerInfoSchema,
  paymentMethod: z.enum(['esewa', 'khalti'], {
    required_error: 'You need to select a payment method.',
  }),
  walletId: z.string().optional(),
  message: z.string().optional(),
}).refine(data => data.paymentMethod ? !!data.walletId && data.walletId.length > 0 : true, {
    message: "Wallet ID is required",
    path: ["walletId"],
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart, isCartMounted } = useCart();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer: {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
      },
      paymentMethod: undefined,
      walletId: '',
      message: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.setValue('customer.firstName', currentUser.name.split(' ')[0] || '');
      form.setValue('customer.lastName', currentUser.name.split(' ').slice(1).join(' ') || '');
      form.setValue('customer.email', currentUser.email);
    }
  }, [currentUser, form]);
  
   useEffect(() => {
    if (isCartMounted && totalItems === 0 && !isProcessing) {
      router.replace('/cart');
    }
  }, [isCartMounted, totalItems, isProcessing, router]);


  const onSubmit = (data: CheckoutFormValues) => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
        const newOrder: Order = {
            id: `NEm-${Date.now().toString().slice(-6)}`,
            date: new Date().toISOString(),
            items: items,
            total: totalPrice,
            customer: data.customer,
            paymentMethod: data.paymentMethod,
            walletId: data.walletId,
            message: data.message,
            paymentStatus: 'Pending',
        };
        
        // Save order to localStorage
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
        localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));

        // Dispatch a custom event to notify other components
        window.dispatchEvent(new CustomEvent('orders-updated'));

        clearCart();
        router.push('/checkout/success');
    }, 1500);
  };
  
  if (!isCartMounted || totalItems === 0) {
      return (
          <div className="container flex items-center justify-center py-20 text-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <p>Loading or redirecting...</p>
              </div>
          </div>
      );
  }

  return (
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
                            <FormField control={form.control} name="customer.email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input type="email" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
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
                            <CardTitle>Payment</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl><RadioGroupItem value="esewa" /></FormControl>
                                                    <FormLabel className="font-normal flex items-center gap-2">
                                                        <Image src="https://blog.esewa.com.np/wp-content/uploads/2022/12/esewa-icon.png" width={24} height={24} alt="eSewa" /> eSewa
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl><RadioGroupItem value="khalti" /></FormControl>
                                                    <FormLabel className="font-normal flex items-center gap-2">
                                                        <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Khalti_Digital_Wallet_Logo.png/640px-Khalti_Digital_Wallet_Logo.png" width={48} height={24} alt="Khalti" />
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <div className="mt-4">
                                <FormField
                                    control={form.control}
                                    name="walletId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Wallet ID (Phone or Email)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Your eSewa/Khalti account ID" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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
                                        <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                                <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
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
                                    'Place Order'
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                        By placing your order, you agree to our Terms of Service and Privacy Policy. Payment will be requested for verification after submission.
                    </p>
                </div>
            </form>
        </Form>
    </div>
  );
}
