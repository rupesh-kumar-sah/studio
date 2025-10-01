
'use client';

import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/components/categories/category-provider";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useMemo } from "react";
import type { Category as CategoryType } from "@/lib/types";

// Helper to create a seeded, stable ID from a category name
const generateId = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        const char = name.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};


export function CategoryShowcase() {
    const { categories } = useCategories();

    const categoryData = useMemo(() => {
        if (!PlaceHolderImages || PlaceHolderImages.length === 0) {
            return [];
        }
        
        const imageMap: { [key: string]: typeof PlaceHolderImages[0] | undefined } = {
            'Clothing': PlaceHolderImages.find(p => p.id === 'clothing-1'),
            'Shoes': PlaceHolderImages.find(p => p.id === 'shoe-1'),
            'Accessories': PlaceHolderImages.find(p => p.id === 'accessory-1'),
            'Electronics': PlaceHolderImages.find(p => p.id === 'accessory-4'),
        };

        return categories.map((category: CategoryType) => {
            const image = imageMap[category] || PlaceHolderImages.find(p => p.id === 'clothing-2');
            
            if (!image) {
                 // Fallback if clothing-2 is also missing for some reason
                return {
                    id: generateId(category),
                    name: category,
                    imageUrl: 'https://picsum.photos/seed/placeholder/600/400',
                    imageHint: 'placeholder',
                    description: `Placeholder image for ${category}`,
                };
            }
            
            return {
                id: generateId(category),
                name: category,
                imageUrl: image.imageUrl,
                imageHint: image.imageHint,
                description: `Image for ${category} category`,
            };
        });
    }, [categories]);

    return (
        <section className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {categoryData.slice(0, 4).map((category) => (
                    <Link href={`/products?category=${category.name}`} key={category.id} 
                        className="relative block group w-full aspect-square overflow-hidden rounded-lg">
                         <Image
                            src={category.imageUrl}
                            alt={category.description}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(min-width: 768px) 25vw, 50vw"
                            data-ai-hint={category.imageHint}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wider">{category.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
      </section>
    )
}
