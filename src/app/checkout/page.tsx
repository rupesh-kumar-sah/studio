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

const shippingSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  paymentMethod: z.enum(["card", "esewa", "khalti"], {
    required_error: "You need to select a payment method.",
  }),
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
    },
  });

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
                <CardContent>
                  <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl><RadioGroupItem value="card" /></FormControl>
                            <FormLabel className="font-normal flex-1">Credit/Debit Card</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl><RadioGroupItem value="esewa" /></FormControl>
                            <FormLabel className="font-normal flex-1">eSewa</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl><RadioGroupItem value="khalti" /></FormControl>
                            <FormLabel className="font-normal flex-1">Khalti</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>
              <Button type="submit" size="lg" className="w-full">Place Order</Button>
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
                <div key={item.product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                       <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex-col items-stretch space-y-2 border-t pt-4">
                <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>${totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>Free</p>
                </div>
                 <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <p>Total</p>
                    <p>${totalPrice.toFixed(2)}</p>
                </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
