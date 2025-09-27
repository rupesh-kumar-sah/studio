
'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { AdminProductCard } from '@/components/products/admin-product-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddProductSheet } from '@/components/products/add-product-sheet';
import { Input } from '@/components/ui/input';
import { getProducts } from '@/lib/products-db';

function AdminProductsPageContent() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [isAddSheetOpen, setAddSheetOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
        const products = await getProducts();
        setAllProducts(products);
    }
    loadProducts();
  }, []);
  
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter((product: Product) => {
      return product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase());
    });

    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'popularity':
         filtered.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
        break;
      default: // featured
        filtered.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
        break;
    }
    
    return filtered;
  }, [allProducts, search, sort]);

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
        <p className="text-muted-foreground">Add, edit, or remove products from your store.</p>
      </div>
        
      <main>
          <div className="flex items-center justify-between mb-6">
            <div className="w-full max-w-sm">
              <Input 
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setAddSheetOpen(true)}>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add New Product
              </Button>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="newest">Latest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Avg. Customer Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map(product => (
                <AdminProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-16">
              <h3 className="text-2xl font-semibold">No products found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search term.</p>
             </div>
          )}
        </main>
        
        <AddProductSheet isOpen={isAddSheetOpen} onOpenChange={setAddSheetOpen} />

    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <AdminProductsPageContent />
    </Suspense>
  )
}
