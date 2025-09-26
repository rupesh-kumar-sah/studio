import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { products } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/products/product-card';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');
  const featuredProducts = products.slice(0, 4);
  const categories = [
    { name: 'Clothing', href: '/products?category=Clothing', image: PlaceHolderImages.find(p => p.id === 'clothing-1') },
    { name: 'Shoes', href: '/products?category=Shoes', image: PlaceHolderImages.find(p => p.id === 'shoe-1') },
    { name: 'Accessories', href: '/products?category=Accessories', image: PlaceHolderImages.find(p => p.id === 'accessory-1') },
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh]">
        {heroImage && (
            <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container h-full flex flex-col items-center justify-center text-center text-white">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white backdrop-blur-sm">New Arrivals</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Discover Authentic Nepali Craft</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-neutral-200">
            From the Himalayas to your home. Explore our curated collection of clothing, shoes, and accessories.
          </p>
          <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
              <Link href="/products">Shop Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#categories">Explore Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container">
        <div className="flex flex-col items-center text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">Hand-picked selections that our customers love.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Categories Section */}
      <section id="categories" className="container scroll-mt-20">
        <div className="flex flex-col items-center text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">Find what you're looking for with our curated categories.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
                <Link href={category.href} key={category.name} className="group relative block">
                    <div className="relative w-full h-80 overflow-hidden rounded-lg">
                        {category.image && (
                            <Image
                                src={category.image.imageUrl}
                                alt={category.image.description}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={category.image.imageHint}
                            />
                        )}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-3xl font-bold text-white">{category.name}</h3>
                    </div>
                </Link>
            ))}
        </div>
      </section>

    </div>
  );
}
