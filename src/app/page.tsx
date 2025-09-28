import { ArrowRight, Star, Award, Truck, Shield, ShoppingBag } from 'lucide-react';
import { getProducts } from '@/app/actions/product-actions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/products/product-card';
import { getCategories } from '@/lib/categories-db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();
  const featuredProducts = products.slice(0, 4);
  const categoryImages = {
    'Clothing': PlaceHolderImages.find(p => p.id === 'clothing-1'),
    'Shoes': PlaceHolderImages.find(p => p.id === 'shoe-1'),
    'Accessories': PlaceHolderImages.find(p => p.id === 'accessory-2'),
    'Electronics': PlaceHolderImages.find(p => p.id === 'accessory-4'),
  } as Record<string, any>;

  const whyChooseUs = [
    {
      icon: Award,
      title: 'Authentic Nepali Goods',
      description: 'Every item is sourced locally, ensuring genuine quality and supporting Nepali artisans.',
    },
    {
      icon: Truck,
      title: 'Fast, Reliable Shipping',
      description: 'Get your orders delivered swiftly and securely, anywhere within our serviceable areas.',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your transactions are safe with us, using industry-standard payment gateways.',
    },
  ];

  const testimonials = [
    {
      name: 'Anjali S.',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'Verified Customer',
      comment: 'The quality of the jacket I bought exceeded my expectations. It\'s my new favorite for chilly evenings. The craftsmanship is just amazing!',
    },
    {
      name: 'Bikram T.',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'Trekking Enthusiast',
      comment: 'Ordered the trekking boots for my Annapurna trip and they were perfect. Comfortable, durable, and delivered right on time. Highly recommended!',
    },
     {
      name: 'Sunita M.',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'Happy Shopper',
      comment: 'I love the artisan backpack! It\'s so unique and I get compliments on it all the time. It\'s great to support local artisans through Nepal eMart.',
    },
  ];


  return (
    <>
      <Header />
      <div className="space-y-16 md:space-y-24 pb-16">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] md:h-[80vh] bg-gray-900 text-white">
          <div className="container h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Made in Nepal – Shop Smart, Shop Local.</h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-300">
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

        {/* Festive Sale Banner */}
        <section className="bg-primary/10 py-12">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                  <Badge>Limited Time Offer</Badge>
                  <h2 className="text-3xl font-bold tracking-tight mt-2">Festive Sale</h2>
                  <p className="mt-1 text-4xl font-extrabold text-primary">Up to 20% Off</p>
                  <p className="mt-2 text-muted-foreground max-w-lg">
                      Celebrate the season with incredible deals on your favorite Nepali products. Don't miss out!
                  </p>
              </div>
              <div className="flex-shrink-0">
                  <Button asChild size="lg" className="px-10 py-6 text-lg">
                      <Link href="/products">
                          <ShoppingBag className="mr-3 h-6 w-6" />
                          Shop the Sale
                      </Link>
                  </Button>
              </div>
          </div>
        </section>


        {/* Featured Products Section */}
        <section className="container">
          <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">Hand-picked selections that our customers love.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
           <div className="mt-12 text-center">
              <Button asChild size="lg" variant="outline">
                  <Link href="/products">View All Products <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
          </div>
        </section>
        
        {/* Categories Section */}
        <section id="categories" className="container scroll-mt-20">
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
        
        {/* Why Choose Us Section */}
        <section className="bg-secondary py-16">
          <div className="container">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Why Choose Nepal eMart?</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">Experience the difference of authentic craftsmanship and dedicated service.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyChooseUs.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container">
          <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">What Our Customers Say</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">Real stories from satisfied shoppers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
