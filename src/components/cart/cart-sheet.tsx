
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2 } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { useState } from 'react';

export function CartSheet() {
  const { items, totalItems, totalPrice, isCartMounted } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (!isCartMounted) {
    return (
      <Button variant="outline" size="icon" className="relative" disabled>
        <ShoppingCart className="h-5 w-5" />
        <span className="sr-only">Open cart</span>
      </Button>
    );
  }


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        <Separator />
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 px-6 py-4">
                {items.map((item) => (
                  <CartEntry key={item.cartItemId} item={item} setSheetOpen={setIsOpen} />
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="bg-secondary px-6 py-4 mt-auto">
              <div className="w-full space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>Rs.{totalPrice.toFixed(2)}</span>
                </div>
                 <Button asChild size="lg" className="w-full" onClick={() => setIsOpen(false)}>
                  <Link href="/cart">View Cart & Checkout</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingCart className="h-24 w-24 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild onClick={() => setIsOpen(false)}>
                <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartEntry({ item, setSheetOpen }: { item: CartItem, setSheetOpen: (open: boolean) => void }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 overflow-hidden rounded-md">
        <Image
          src={item.product.images[0].url}
          alt={item.product.images[0].alt}
          fill
          className="object-cover"
          sizes="96px"
          data-ai-hint={item.product.images[0].hint}
        />
      </div>
      <div className="flex-1">
        <Link href={`/products/${item.product.id}`} className="font-semibold hover:underline" onClick={() => setSheetOpen(false)}>
            {item.product.name}
        </Link>
        <p className="text-sm text-muted-foreground">
          {item.size} / {item.color !== 'Natural' ? item.color : ''}
        </p>
        <p className="font-medium">Rs.{item.product.price.toFixed(2)}</p>
        <div className="mt-2 flex items-center justify-between">
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => {
                const newQuantity = parseInt(e.target.value, 10);
                if (!isNaN(newQuantity)) {
                    updateQuantity(item.cartItemId, newQuantity)
                }
            }}
            className="h-8 w-16"
            aria-label={`Quantity for ${item.product.name}`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.cartItemId)}
            aria-label={`Remove ${item.product.name} from cart`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
