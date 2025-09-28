
"use client";

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { useCart } from '@/components/cart/cart-provider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { ShoppingCart, Ban } from 'lucide-react';

interface AddToCartFormProps {
  product: Product;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { addItem, getItemQuantity } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(product, selectedSize, selectedColor);
  };

  const isOutOfStock = product.stock <= 0;
  const currentCartQuantity = getItemQuantity(product.id, selectedSize, selectedColor);
  const purchaseLimit = product.purchaseLimit || 10;
  
  const reachedStockLimit = currentCartQuantity >= product.stock;
  const reachedPurchaseLimit = currentCartQuantity >= purchaseLimit;

  const canAddToCart = !isOutOfStock && !reachedStockLimit && !reachedPurchaseLimit;
  
  let buttonText = "Add to Cart";
  if (isOutOfStock) {
      buttonText = "Out of Stock";
  } else if (reachedStockLimit) {
      buttonText = "No More in Stock";
  } else if (reachedPurchaseLimit) {
      buttonText = "Purchase Limit Reached";
  }


  if (isOutOfStock) {
    return (
        <div className="space-y-6">
            <Button disabled size="lg" className="w-full">
                <Ban className="mr-2 h-5 w-5" />
                Out of Stock
            </Button>
        </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {product.sizes.length > 1 && product.sizes[0] !== 'One Size' && (
        <div>
          <Label className="font-semibold text-base">Size: {selectedSize}</Label>
          <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2 mt-2">
            {product.sizes.map(size => (
              <div key={size}>
                <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                <Label
                  htmlFor={`size-${size}`}
                  className={cn(
                    "flex items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-medium hover:bg-secondary/80 cursor-pointer",
                    selectedSize === size ? "bg-secondary border-primary" : "bg-transparent"
                  )}
                >
                  {size}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {product.colors.length > 1 && product.colors[0] !== 'Natural' && (
        <div>
          <Label className="font-semibold text-base">Color</Label>
          <div className="flex flex-wrap gap-3 mt-2">
            {product.colors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all",
                  selectedColor === color ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-muted'
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      )}
      
      <Button type="submit" size="lg" className="w-full" disabled={!canAddToCart}>
        {canAddToCart ? <ShoppingCart className="mr-2 h-5 w-5" /> : <Ban className="mr-2 h-5 w-5" />}
        {buttonText}
      </Button>
    </form>
  );
}
