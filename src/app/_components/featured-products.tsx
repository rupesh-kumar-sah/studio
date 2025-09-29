
import { getProducts } from '@/app/actions/product-actions';
import { ProductCard } from '@/components/products/product-card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export async function FeaturedProducts() {
  const allProducts = await getProducts();
  
  // Sort by popularity (number of reviews) and take the top 4
  const featuredProducts = allProducts
    .sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
    .slice(0, 4);

  return (
    <section className="container">
      <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="text-muted-foreground max-w-md mt-2">
            Discover our best-selling items, loved by customers for their quality and style.
          </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
       <div className="mt-12 text-center">
        <Link href="/products" className={cn(buttonVariants({ size: 'lg' }))}>
          View All Products
        </Link>
      </div>
    </section>
  );
}
