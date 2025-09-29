
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductImageGalleryProps {
  product: Product;
}

export function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const handleThumbClick = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className="flex flex-col gap-4">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {product.images.map((image, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                      data-ai-hint={image.hint}
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
      <div className="grid grid-cols-5 gap-2">
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbClick(index)}
            className={cn(
              "overflow-hidden rounded-md aspect-square relative transition-all",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              api?.selectedScrollSnap() === index ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
            )}
          >
            <Image
              src={image.url}
              alt={`Thumbnail for ${image.alt}`}
              fill
              className="object-cover"
              sizes="100px"
              data-ai-hint={image.hint}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
