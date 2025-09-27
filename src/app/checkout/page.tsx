
"use client";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Banknote, CreditCard, ShieldCheck, Loader2, CheckCircle2, QrCode } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";

const shippingSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  message: z.string().optional(),
  paymentMethod: z.enum(["card", "esewa", "khalti", "cod"], {
    required_error: "You need to select a payment method.",
  }),
  walletId: z.string().optional(),
}).refine(data => {
  if ((data.paymentMethod === 'esewa' || data.paymentMethod === 'khalti') && (!data.walletId || data.walletId.length < 10)) {
    return false;
  }
  return true;
}, {
  message: "A valid wallet ID (phone number) is required.",
  path: ["walletId"],
});

export type Order = {
  id: string;
  customer: Omit<z.infer<typeof shippingSchema>, 'paymentMethod' | 'walletId' | 'message'>;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending';
  walletId?: string;
  date: string;
  message?: string;
};

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQrDialog, setShowQrDialog] = useState(false);

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postalCode: "",
      message: "",
      walletId: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");
  
  function handlePlaceOrder() {
    setShowQrDialog(false);
    setIsProcessing(true);
    // Redirect to success page after a short delay
    setTimeout(() => {
        router.push("/checkout/success");
    }, 1000);
  }

  function onSubmit(data: z.infer<typeof shippingSchema>) {
    setIsProcessing(true);

    const orderId = `NEM-${new Date().getTime()}`;
    
    const newOrder: Order = {
        id: orderId,
        customer: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
        },
        items,
        total: totalPrice,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'Pending',
        walletId: data.walletId,
        date: new Date().toISOString(),
        message: data.message,
    };
    
    // Save order to localStorage immediately for all payment types
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    localStorage.setItem('orders', JSON.stringify([...existingOrders, newOrder]));

    if (data.paymentMethod === 'esewa') {
        setShowQrDialog(true);
        setIsProcessing(false); // Stop loader, dialog will show
        return; 
    }

    router.push("/checkout/success");
  }

  if (totalItems === 0 && !isProcessing) {
    return (
        <div className="container flex flex-col items-center justify-center text-center py-20">
            <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
            <p className="mt-2 text-muted-foreground">You can't proceed to checkout without any items.</p>
            <Button asChild className="mt-6">
                <Link href="/products">Go Shopping</Link>
            </Button>
        </div>
    )
  }

  return (
    <>
       <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle>Scan to Pay with eSewa</DialogTitle>
            <DialogDescription>
                Scan the QR code with your eSewa app to complete the payment of <strong>Rs.{totalPrice.toFixed(2)}</strong>.
            </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
                {/* Placeholder for QR Code */}
                <Image 
                    src="https://picsum.photos/seed/esewa-qr/300/300"
                    alt="eSewa QR Code" 
                    width={300} 
                    height={300} 
                    data-ai-hint="QR code"
                />
            </div>
            <DialogFooter className="sm:justify-center">
                 <div className="text-center space-y-4 w-full">
                    <p className="text-sm text-muted-foreground">After payment is complete, click the button below to confirm your order.</p>
                    <Button type="button" className="w-full" onClick={handlePlaceOrder}>
                        I Have Paid
                    </Button>
                 </div>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {isProcessing && !showQrDialog ? (
          <div className="container flex flex-col items-center justify-center text-center py-40">
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
            <h1 className="text-2xl font-bold">Processing Your Order...</h1>
            <p className="mt-2 text-muted-foreground">Please wait a moment.</p>
          </div>
      ) : (
        <div className="container py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                    <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                        <div className="flex gap-4">
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                            <FormItem className="flex-1">
                            <FormLabel>First Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                            <FormItem className="flex-1">
                            <FormLabel>Last Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                        </div>
                        <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                        <div className="flex gap-4">
                        <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem className="flex-1">
                            <FormLabel>City</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="postalCode" render={({ field }) => (
                            <FormItem className="flex-1">
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                        </div>
                        <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem>
                            <FormLabel>Message to Owner (Optional)</FormLabel>
                            <FormControl><Textarea placeholder="Add any special instructions for your order..." {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    </Card>

                    <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                                <FormItem className="rounded-md border p-4 data-[state=checked]:border-primary">
                                <FormControl><RadioGroupItem value="cod" id="cod" className="sr-only"/></FormControl>
                                <FormLabel htmlFor="cod" className="font-normal flex items-center space-x-3 cursor-pointer">
                                    <Banknote />
                                    <span>Cash on Delivery (COD)</span>
                                </FormLabel>
                                </FormItem>
                                <FormItem className="rounded-md border p-4 data-[state=checked]:border-primary">
                                <FormControl><RadioGroupItem value="esewa" id="esewa" className="sr-only"/></FormControl>
                                <FormLabel htmlFor="esewa" className="font-normal flex items-center space-x-3 cursor-pointer">
                                    <Image src="https://blog.esewa.com.np/wp-content/uploads/2022/11/eSewa-Logo.png" alt="eSewa" width={60} height={24} />
                                    <span>eSewa</span>
                                </FormLabel>
                                </FormItem>
                                <FormItem className="rounded-md border p-4 data-[state=checked]:border-primary">
                                <FormControl><RadioGroupItem value="khalti" id="khalti" className="sr-only"/></FormControl>
                                <FormLabel htmlFor="khalti" className="font-normal flex items-center space-x-3 cursor-pointer">
                                    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Khalti_Digital_Wallet_Logo.png.600px-Khalti_Digital_Wallet_Logo.png" alt="Khalti" width={60} height={24} />
                                    <span>Khalti</span>
                                </FormLabel>
                                </FormItem>
                                <FormItem className="rounded-md border p-4 data-[state=checked]:border-primary">
                                <FormControl><RadioGroupItem value="card" id="card" className="sr-only" /></FormControl>
                                <FormLabel htmlFor="card" className="font-normal flex items-center space-x-3 cursor-pointer">
                                    <CreditCard />
                                    <span>Credit/Debit Card</span>
                                </FormLabel>
                                </FormItem>
                            </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                        {(paymentMethod === 'esewa' || paymentMethod === 'khalti') && (
                        <FormField control={form.control} name="walletId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enter your Registered {paymentMethod === 'esewa' ? 'eSewa' : 'Khalti'} Number:</FormLabel>
                                <FormControl><Input type="tel" placeholder="98XXXXXXXX" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )} />
                        )}
                        {paymentMethod === 'card' && (
                        <div className="text-sm text-muted-foreground p-4 border rounded-md">
                            You will be redirected to a secure payment gateway to complete your purchase.
                        </div>
                        )}
                    </CardContent>
                    </Card>
                    <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {paymentMethod === 'esewa' ? 'Pay with eSewa' : paymentMethod === 'khalti' ? 'Pay with Khalti' : 'Place Order'}
                    </Button>
                    <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Your financial information is securely processed and is never stored on our servers.</span>
                    </div>
                </form>
                </Form>
            </div>

            <div className="lg:sticky top-24 self-start">
                <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {items.map(item => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden">
                            <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div>
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        </div>
                        <p className="font-medium">Rs.{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                    ))}
                </CardContent>
                <CardFooter className="flex-col items-stretch space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p>Rs.{totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p>Shipping</p>
                        <p>Free</p>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <p>Total</p>
                        <p>Rs.{totalPrice.toFixed(2)}</p>
                    </div>
                </CardFooter>
                </Card>
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>Need help? Contact our support team.</p>
                </div>
            </div>
            </div>
        </div>
      )}
    </>
  );
}

    