

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getProductById } from '@/app/actions/product-actions';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { AddToCartForm } from './_components/add-to-cart-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Edit } from 'lucide-react';
import { EditProductSheet } from '@/components/products/edit-product-sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { getIsOwner } from '@/lib/auth-db';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { ProductReviews } from '@/components/products/product-reviews';

const ProductRecommendations = dynamic(() => import('@/components/products/product-recommendations').then(mod => mod.ProductRecommendations), {
  loading: () => <Skeleton className="h-48 w-full" />,
});


export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProductById(id);
  const isOwner = await getIsOwner();

  if (!product) {
    notFound();
  }
  
  const rating = product.detailedReviews && product.detailedReviews.length > 0 
    ? product.detailedReviews.reduce((acc, review) => acc + review.rating, 0) / product.detailedReviews.length
    : 0;
  
  const reviews = product.detailedReviews?.length || 0;

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <>
      <Header />
      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <ProductImageGallery product={product} />
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                {isOwner && (
                  <EditProductSheet product={product}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-5 w-5" />
                      <span className="sr-only">Edit Product</span>
                    </Button>
                  </EditProductSheet>
                )}
              </div>
              <div className="flex items-center flex-wrap gap-3 mt-2">
                <p className="text-2xl font-bold text-primary">Rs.{product.price.toFixed(2)}</p>
                 {product.originalPrice && (
                    <p className="text-xl text-muted-foreground line-through">
                        Rs.{product.originalPrice.toFixed(2)}
                    </p>
                )}
                 {discount > 0 && (
                    <Badge variant="destructive">{discount}% OFF</Badge>
                )}
                {product.stock > 0 && product.stock <= 10 && (
                    <Badge variant="outline" className="text-amber-600 border-amber-500">Low Stock</Badge>
                )}
                 {product.stock === 0 && (
                    <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(rating) ? 'fill-current' : 'fill-muted stroke-muted-foreground'}`}/>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
              </div>
            </div>

            <Separator />

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <AddToCartForm product={product} />

          </div>
        </div>
        
        <div className="mt-16">
           <ProductReviews product={product} />
        </div>

        <div className="mt-16">
          <ProductRecommendations currentProductId={product.id} />
        </div>
      </div>
      <Footer />
    </>
  );
}
