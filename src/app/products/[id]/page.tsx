
'use client';

import { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { useProducts } from '@/components/products/product-provider';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { AddToCartForm } from './_components/add-to-cart-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, Edit } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { EditProductSheet } from '@/components/products/edit-product-sheet';
import { ProductRecommendations } from '@/components/products/product-recommendations';

export default function ProductDetailPage({ params: { id } }: { params: { id: string } }) {
  const { getProductById } = useProducts();
  const { isOwner } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const product = useMemo(() => getProductById(id), [id, getProductById]);

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <ProductImageGallery product={product} />
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              {isOwner && (
                <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                  <Edit className="h-5 w-5" />
                  <span className="sr-only">Edit Product</span>
                </Button>
              )}
            </div>
            <p className="text-2xl font-semibold mt-2">Rs.{product.price.toFixed(2)}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-primary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'fill-current' : 'fill-muted stroke-muted-foreground'}`}/>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          <Separator />

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <AddToCartForm product={product} />

        </div>
      </div>
      
      <div className="mt-16">
        <ProductRecommendations currentProductId={product.id} />
      </div>

      {isOwner && (
        <EditProductSheet
          product={product}
          isOpen={isEditing}
          onOpenChange={setIsEditing}
        />
      )}
    </div>
  );
}
