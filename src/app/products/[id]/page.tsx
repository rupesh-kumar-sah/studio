import { getProductById, products } from '@/lib/products';
import { notFound } from 'next/navigation';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { Star } from 'lucide-radix';
import { Badge } from '@/components/ui/badge';
import { AddToCartForm } from './_components/add-to-cart-form';
import { ProductRecommendations } from '@/components/products/product-recommendations';
import { Separator } from '@/components/ui/separator';

export async function generateStaticParams() {
    return products.map(product => ({
        id: product.id,
    }));
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <ProductImageGallery product={product} />

        <div className="space-y-6">
          <div>
            <Badge variant="outline">{product.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-primary">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? 'fill-current' : 'fill-muted stroke-muted-foreground'}`}/>
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>
          
          <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>

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
  );
}
