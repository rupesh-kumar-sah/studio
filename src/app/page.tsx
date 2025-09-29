
import { Header } from "@/components/layout/header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CategoryShowcase } from "./_components/category-showcase";
import { FeaturedProducts } from "./_components/featured-products";
import { Footer } from "@/components/layout/footer";

export default function Home() {
    const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');
    
    return (
        <>
          <Header />
          <div className="space-y-20 md:space-y-28 pb-20">
            {/* Hero Section */}
            <section className="relative w-full h-[60vh] md:h-[80vh] text-white">
              {heroImage && (
                 <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover -z-10 brightness-50"
                  sizes="100vw"
                  priority
                  data-ai-hint={heroImage.imageHint}
                />
              )}
              <div className="container h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Authentic Nepali Goods, Delivered.</h1>
                <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
                  From the Himalayas to your home. Explore our curated collection of clothing, shoes, and accessories.
                </p>
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <Link href="/products"
                    className={cn(buttonVariants({ size: "lg" }))}>
                    Shop The Collection
                  </Link>
                  <Link
                    href="/products"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "border-white text-white hover:bg-white/10"
                    )}>
                    Browse All Products
                  </Link>
                </div>
              </div>
            </section>

            {/* Featured Categories */}
            <CategoryShowcase />

            {/* Featured Products */}
            <FeaturedProducts />

          </div>
          <Footer />
        </>
      );
}
