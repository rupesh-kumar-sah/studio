
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, isCartMounted } = useCart();
  const router = useRouter();

  if (!isCartMounted) {
    return (
      <div className="container py-12 text-center">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
        <>
        <Header />
        <div className="container py-12 text-center">
            <Card className="max-w-md mx-auto">
            <CardHeader>
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
                <CardTitle className="mt-4">Your Cart is Empty</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">You have no items in your shopping cart.</p>
                <Button onClick={() => router.push('/products')} className="mt-6">
                Continue Shopping
                </Button>
            </CardContent>
            </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
    <Header />
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Shopping Cart</h1>
        <p className="mt-2 text-lg text-muted-foreground">Review your items and proceed to checkout.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Product</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-center w-[120px]">Quantity</TableHead>
                    <TableHead className="text-right w-[120px]">Price</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.cartItemId}>
                      <TableCell>
                        <div className="relative h-24 w-24 rounded-md overflow-hidden">
                          <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" sizes="96px" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/products/${item.product.id}`} className="font-semibold hover:underline">{item.product.name}</Link>
                        <p className="text-sm text-muted-foreground">{item.size} / {item.color}</p>
                        <p className="text-sm font-medium">Rs.{item.product.price.toFixed(2)}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="1"
                          max={item.product.purchaseLimit || 99}
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value, 10);
                            updateQuantity(item.cartItemId, isNaN(newQuantity) ? 0 : newQuantity);
                          }}
                          className="h-9 w-20 mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        Rs.{(item.product.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.cartItemId)}>
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal ({totalItems} items)</p>
                <p className="font-medium">Rs.{totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Shipping</p>
                <p className="font-medium">Calculated at next step</p>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
               <div className="w-full flex justify-between font-bold text-lg border-t pt-4">
                <p>Total</p>
                <p>Rs.{totalPrice.toFixed(2)}</p>
              </div>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
