
"use client";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Banknote, CreditCard, ShieldCheck } from "lucide-react";

const shippingSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
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


export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      postalCode: "",
      walletId: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  function onSubmit(data: z.infer<typeof shippingSchema>) {
    console.log("Order placed:", data);
    clearCart();
    router.push("/checkout/success");
  }

  if (totalItems === 0) {
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
                          <FormControl><Input type="tel" placeholder="+977-98XXXXXXXX" {...field} /></FormControl>
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
              <Button type="submit" size="lg" className="w-full">
                {paymentMethod === 'esewa' || paymentMethod === 'khalti' ? `Pay with ${paymentMethod}` : 'Place Order'}
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
                <p>Need help? Call us at <a href="tel:9824812753" className="font-medium text-primary hover:underline">9824812753</a></p>
            </div>
        </div>
      </div>
    </div>
  );
}

    