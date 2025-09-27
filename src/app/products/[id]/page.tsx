
'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { useProducts } from '@/components/products/product-provider';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { AddToCartForm } from './_components/add-to-cart-form';
import { Star, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/auth-provider';
import { EditProductSheet } from '@/components/products/edit-product-sheet';
import { ProductRecommendations } from '@/components/products/product-recommendations';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { getProductById } = useProducts();
  const { isOwner } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <ProductImageGallery product={product} />
          </div>
          <div className="space-y-6">
            <div>
              {isOwner && (
                <div className="flex justify-end mb-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Product
                  </Button>
                </div>
              )}
              <Badge variant="secondary">{product.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'fill-current' : 'fill-muted stroke-muted-foreground'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>
            <p className="text-muted-foreground text-lg">{product.description}</p>
            <p className="text-3xl font-bold">Rs.{product.price.toFixed(2)}</p>
            <AddToCartForm product={product} />
          </div>
        </div>
        <div className="mt-16">
          <ProductRecommendations currentProductId={product.id} />
        </div>
      </div>
      {isOwner && (
        <EditProductSheet
          product={product}
          isOpen={isEditing}
          onOpenChange={setIsEditing}
        />
      )}
    </>
  );
}
