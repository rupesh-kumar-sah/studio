
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
  
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg group">
      <CardHeader className="p-0 border-b relative">
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
        {hasDiscount && (
            <Badge variant="destructive" className="absolute top-3 right-3">
                - {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
            </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
            <div className="flex justify-between items-start gap-2">
                <Link href={`/products/${product.id}`} className="font-semibold text-base hover:underline pr-2 flex-1">
                    {product.name}
                </Link>
                <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
             <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-amber-500" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-current' : 'fill-muted stroke-muted-foreground'}`}/>
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews})</span>
            </div>
        </div>

        <div className="flex justify-between items-end mt-4">
             <div>
                {hasDiscount && (
                    <p className="text-sm text-muted-foreground line-through">Rs.{product.originalPrice?.toFixed(2)}</p>
                )}
                <p className="text-lg font-bold text-primary" aria-label={`Price: Rs.${product.price.toFixed(2)}`}>Rs.{product.price.toFixed(2)}</p>
            </div>
            <Button onClick={handleAddToCart} size="icon" variant="outline" aria-label={`Add ${product.name} to cart`}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
