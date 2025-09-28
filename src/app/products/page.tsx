
'use client';

import { useState, useMemo, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from '@/components/products/product-filters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getProducts } from '@/lib/products-db';
import { useAuth } from '@/components/auth/auth-provider';
import { AddProductSheet } from '@/components/products/add-product-sheet';
import { PlusCircle } from 'lucide-react';

function ProductsPageContent() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const { isOwner } = useAuth();
  const [isAddSheetOpen, setAddSheetOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    const products = await getProducts();
    setAllProducts(products);
  }, []);

  useEffect(() => {
    loadProducts();

    const handleProductUpdate = () => {
        loadProducts();
    }
    window.addEventListener('product-updated', handleProductUpdate);
    return () => {
        window.removeEventListener('product-updated', handleProductUpdate);
    }
  }, [loadProducts]);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    price: [0, 300],
    rating: 0,
    colors: [] as string[],
    sizes: [] as string[],
    inStock: true,
  });
  const [sort, setSort] = useState('featured');
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  
  useEffect(() => {
    setFilters(f => ({
      ...f,
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || 'All'
    }));
  }, [searchParams]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter((product: Product) => {
      const searchMatch = product.name.toLowerCase().includes(filters.search.toLowerCase()) || product.description.toLowerCase().includes(filters.search.toLowerCase());
      const categoryMatch = filters.category === 'All' || product.category === filters.category;
      const priceMatch = product.price >= filters.price[0] && product.price <= filters.price[1];
      const ratingMatch = (product.rating || 0) >= filters.rating;
      const colorMatch = filters.colors.length === 0 || product.colors.some(c => filters.colors.includes(c));
      const sizeMatch = filters.sizes.length === 0 || product.sizes.some(s => filters.sizes.includes(s));
      const stockMatch = !filters.inStock || product.stock > 0;
      
      return searchMatch && categoryMatch && priceMatch && ratingMatch && colorMatch && sizeMatch && stockMatch;
    });

    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            if (ratingB === ratingA) {
                return (b.reviews || 0) - (a.reviews || 0);
            }
            return ratingB - ratingA;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
    }
    
    return filtered;
  }, [allProducts, filters, sort]);
  
  const uniqueColors = useMemo(() => [...new Set(allProducts.flatMap(p => p.colors))], [allProducts]);
  const uniqueSizes = useMemo(() => [...new Set(allProducts.flatMap(p => p.sizes))], [allProducts]);

  return (
    <>
    <Header />
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Our Products</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {filters.category !== 'All' ? `Explore our ${filters.category}` : "Explore the collection"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-1/4 hidden lg:block">
          <ProductFilters 
            filters={filters}
            setFilters={setFilters}
            uniqueColors={uniqueColors}
            uniqueSizes={uniqueSizes}
          />
        </aside>
        
        <main className="w-full lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">{filteredAndSortedProducts.length} products found</p>
            <div className="flex items-center gap-4">
              {isOwner && (
                <Button onClick={() => setAddSheetOpen(true)}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Add Product
                </Button>
              )}
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
               <Sheet open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Filter className="h-5 w-5" />
                    <span className="sr-only">Open filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm">
                   <ProductFilters 
                      filters={filters}
                      setFilters={setFilters}
                      uniqueColors={uniqueColors}
                      uniqueSizes={uniqueSizes}
                    />
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-16">
              <h3 className="text-2xl font-semibold">No products found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your filters or search term.</p>
             </div>
          )}
        </main>
      </div>
    </div>
    <Footer />
    <AddProductSheet isOpen={isAddSheetOpen} onOpenChange={setAddSheetOpen} />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ProductsPageContent />
    </Suspense>
  )
}
