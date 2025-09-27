
"use client";

import { useState, useMemo, useEffect } from 'react';
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
import { Filter, PlusCircle } from 'lucide-react';
import { useProducts } from '@/components/products/product-provider';
import { useAuth } from '@/components/auth/auth-provider';
import { AddProductSheet } from '@/components/products/add-product-sheet';

export default function ProductsPage() {
  const { products: allProducts } = useProducts();
  const searchParams = useSearchParams();
  const { isOwner } = useAuth();

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
  const [isAddSheetOpen, setAddSheetOpen] = useState(false);
  
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
      const ratingMatch = product.rating >= filters.rating;
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
        // Sort by rating, then by number of reviews as a tie-breaker
        filtered.sort((a, b) => {
            if (b.rating === a.rating) {
                return b.reviews - a.reviews;
            }
            return b.rating - a.rating;
        });
        break;
      case 'newest':
        // Correctly sort by date of creation (using id as a proxy for timestamp)
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'popularity':
        // Popularity based on number of reviews
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default: // featured (can be same as popularity or a custom logic)
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    
    return filtered;
  }, [allProducts, filters, sort]);
  
  const uniqueColors = useMemo(() => [...new Set(allProducts.flatMap(p => p.colors))], [allProducts]);
  const uniqueSizes = useMemo(() => [...new Set(allProducts.flatMap(p => p.sizes))], [allProducts]);

  return (
    <>
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
                  Add New Product
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
    {isOwner && <AddProductSheet isOpen={isAddSheetOpen} onOpenChange={setAddSheetOpen} />}
    </>
  );
}
