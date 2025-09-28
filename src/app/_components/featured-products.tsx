
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { getProducts } from '@/app/actions/product-actions';
import { useCategories } from '@/components/categories/category-provider';
import { ProductCard } from '@/components/products/product-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function FeaturedProducts() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const { categories } = useCategories();
    
    const categoryImages = {
        'Clothing': PlaceHolderImages.find(p => p.id === 'clothing-1'),
        'Shoes': PlaceHolderImages.find(p => p.id === 'shoe-1'),
        'Accessories': PlaceHolderImages.find(p => p.id === 'accessory-2'),
        'Electronics': PlaceHolderImages.find(p => p.id === 'accessory-4'),
    } as Record<string, any>;

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getProducts();
            setFeaturedProducts(products.slice(0, 4));
        };
        fetchProducts();
    }, []);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <section id="categories" className="container scroll-mt-20 mt-16 md:mt-24">
                <div className="flex flex-col items-center text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
                    <p className="mt-2 max-w-2xl text-muted-foreground">Find what you're looking for with our curated categories.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.slice(0, 3).map((category) => (
                        <Link href={`/products?category=${category}`} key={category} className="group relative block">
                            <div className="relative w-full h-80 overflow-hidden rounded-lg">
                                <Image
                                    src={categoryImages[category]?.imageUrl || 'https://picsum.photos/seed/placeholder/600/800'}
                                    alt={categoryImages[category]?.description || category}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={categoryImages[category]?.imageHint || 'category'}
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h3 className="text-3xl font-bold text-white">{category}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
