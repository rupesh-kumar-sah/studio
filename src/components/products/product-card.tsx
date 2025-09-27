
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg group bg-white">
      <CardHeader className="p-0 border-b relative">
        <Link href={`/products/${product.id}`} className="block" aria-label={`View details for ${product.name}`}>
          <div className="relative aspect-square w-full overflow-hidden">
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
            <Badge className="absolute top-3 left-3 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base">
                - {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
            </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col text-center">
        <div className="flex-1">
            <Link href={`/products/${product.id}`} className="font-semibold text-base hover:underline">
                {product.name}
            </Link>
        </div>
        <div className="mt-4">
             <div className="flex justify-center items-baseline gap-2">
                {hasDiscount && (
                    <p className="text-muted-foreground line-through">NPR{product.originalPrice?.toFixed(2)}</p>
                )}
                <p className="text-lg font-bold text-primary">NPR{product.price.toFixed(2)}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
