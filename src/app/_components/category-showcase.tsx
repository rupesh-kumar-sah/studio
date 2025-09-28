
import Link from "next/link";
import Image from "next/image";
import { getAllCategories } from "@/lib/categories-db";

export async function CategoryShowcase() {
    const categories = await getAllCategories();

    return (
        <section className="container">
            <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {categories.map((category) => (
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
