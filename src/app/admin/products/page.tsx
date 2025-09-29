

import { Suspense } from 'react';
import { AdminProductPageClient } from './_components/admin-product-page-client';
import { getProducts } from '@/app/actions/product-actions';

export default async function AdminProductsPage() {
  const initialProducts = await getProducts();

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
        <p className="text-muted-foreground">Add, edit, or remove products from your store.</p>
      </div>
      <Suspense fallback={<div>Loading products...</div>}>
        <AdminProductPageClient initialProducts={initialProducts} />
      </Suspense>
    </div>
  );
}
