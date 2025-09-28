
'use client';

import { useCategories } from '@/components/categories/category-provider';
import { Card } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

export function CategoryShowcase() {
    const { categories } = useCategories();
    const categoryImages: Record<string, string> = {
        'Clothing': PlaceHolderImages.find(img => img.id === 'clothing-1')?.imageUrl || '',
        'Shoes': PlaceHolderImages.find(img => img.id === 'shoe-1')?.imageUrl || '',
        'Accessories': PlaceHolderImages.find(img => img.id === 'accessory-1')?.imageUrl || '',
        'Electronics': PlaceHolderImages.find(img => img.id === 'accessory-4')?.imageUrl || '',
    };

    return (
        <section id="categories" className="container">
            <div className="flex flex-col items-center text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">Find what you're looking for with our curated categories.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.slice(0, 4).map(category => (
                    <Link key={category} href={`/products?category=${category}`} className="group block">
                        <Card className="overflow-hidden">
                            <div className="relative aspect-[4/3] w-full">
                                <Image
                                    src={categoryImages[category] || 'https://placehold.co/600x400'}
                                    alt={`Image for ${category} category`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40" />
                                <h3 className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                                    {category}
                                </h3>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
