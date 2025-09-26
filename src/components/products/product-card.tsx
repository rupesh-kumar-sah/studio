"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/cart/cart-provider';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    const defaultSize = product.sizes[0] || 'N/A';
    const defaultColor = product.colors[0] || 'N/A';
    addItem(product, defaultSize, defaultColor);
  };
  
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg group">
      <CardHeader className="p-0 border-b">
        <Link href={`/products/${product.id}`} className="block" aria-label={`View details for ${product.name}`}>
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              data-ai-hint={product.images[0].hint}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <div className="flex justify-between items-start">
            <Link href={`/products/${product.id}`} className="font-semibold text-lg hover:underline pr-2">
                {product.name}
            </Link>
            <Badge variant="secondary">{product.category}</Badge>
        </div>
        <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center text-primary" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-current' : 'fill-muted stroke-muted-foreground'}`}/>
                ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews})</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-bold" aria-label={`Price: $${product.price.toFixed(2)}`}>${product.price.toFixed(2)}</p>
        <Button onClick={handleAddToCart} size="icon" variant="outline" aria-label={`Add ${product.name} to cart`}>
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
