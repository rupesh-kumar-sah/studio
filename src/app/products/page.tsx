
import { Suspense } from 'react';
import { ProductsPageClient } from './_components/products-page-client';
import { getProducts } from '@/app/actions/product-actions';

export default async function ProductsPage() {
  const initialProducts = await getProducts();

  return (
    <Suspense fallback={<div className="container py-8 text-center">Loading products...</div>}>
      <ProductsPageClient initialProducts={initialProducts} />
    </Suspense>
  );
}
