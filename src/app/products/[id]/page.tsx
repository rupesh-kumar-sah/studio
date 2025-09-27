
'use client';

import { notFound } from 'next/navigation';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { Star, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AddToCartForm } from './_components/add-to-cart-form';
import { ProductRecommendations } from '@/components/products/product-recommendations';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@/components/products/product-provider';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { useState }
from 'react';
import { EditProductSheet } from '@/components/products/edit-product-sheet';

export default function ProductDetailPage({ params: { id } }: { params: { id: string } }) {
  const { getProductById } = useProducts();
  const { isOwner } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const product = getProductById(id);

  if (!product) {
    // We call notFound() here. Since we are in a client component, 
    // this will throw an error that the nearest not-found boundary will catch.
    // To make this work as expected, we would need a not-found.tsx file.
    // For this prototype, we'll just show a simple message.
    return (
        <div className="container py-12 text-center">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <p className="text-muted-foreground">This product may have been moved or deleted.</p>
        </div>
    );
  }

  return (
    <>
      <div className="container py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <ProductImageGallery product={product} />

          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline">{product.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">{product.name}</h1>
              </div>
              {isOwner && (
                <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                  <Edit className="h-5 w-5" />
                  <span className="sr-only">Edit Product</span>
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
                <div className="flex items-center text-primary">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'fill-current' : 'fill-muted stroke-muted-foreground'}`}/>
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
            
            <p className="text-3xl font-bold">Rs.{product.price.toFixed(2)}</p>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <AddToCartForm product={product} />

            <Separator />
            
            <div className="text-sm text-muted-foreground">
              <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}</p>
              <p><strong>SKU:</strong> NEP-EMART-{product.id.padStart(4, '0')}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24">
           <h2 className="text-3xl font-bold tracking-tight text-center mb-8">You Might Also Like</h2>
           <ProductRecommendations currentProductId={product.id} />
        </div>
      </div>
      <EditProductSheet 
        product={product}
        isOpen={isEditing}
        onOpenChange={setIsEditing}
      />
    </>
  );
}
