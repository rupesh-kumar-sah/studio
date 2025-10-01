'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../auth/auth-provider';
import { EditProductSheet } from './edit-product-sheet';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isOwner } = useAuth();
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

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
        {discount > 0 && (
            <Badge variant="destructive" className="absolute top-3 right-3">
                {discount}% OFF
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
                <p className="text-lg font-bold text-primary">Rs.{product.price.toFixed(2)}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                    <p className="text-sm text-muted-foreground line-through">
                        Rs.{product.originalPrice.toFixed(2)}
                    </p>
                )}
            </div>
        </div>
      </CardContent>
       {isOwner && (
        <CardFooter className="p-2 border-t">
          <EditProductSheet product={product}>
            <Button variant="ghost" className="w-full">
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </EditProductSheet>
        </CardFooter>
      )}
    </Card>
  );
}
