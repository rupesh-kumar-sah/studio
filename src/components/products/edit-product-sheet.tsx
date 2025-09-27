
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product } from '@/lib/types';
import { useProducts } from './product-provider';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';


const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().int().min(0, 'Stock must be a positive integer'),
  category: z.enum(['Clothing', 'Shoes', 'Accessories']),
  colors: z.string().min(1, "Please enter at least one color."),
  sizes: z.string().min(1, "Please enter at least one size."),
});

interface EditProductSheetProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditProductSheet({ product, isOpen, onOpenChange }: EditProductSheetProps) {
  const { updateProduct } = useProducts();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      colors: product.colors.join(','),
      sizes: product.sizes.join(','),
    },
  });
  
  // Reset form when product changes or sheet opens
  React.useEffect(() => {
    if (isOpen) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        colors: product.colors.join(','),
        sizes: product.sizes.join(','),
      });
      setImagePreview(null); // Clear image preview as well
    }
  }, [product, isOpen, reset]);


  const onSubmit = (data: z.infer<typeof productSchema>) => {
    const updatedProduct: Product = {
      ...product,
      ...data,
      colors: data.colors.split(',').map(c => c.trim()).filter(Boolean),
      sizes: data.sizes.split(',').map(s => s.trim()).filter(Boolean),
    };
    // Note: Image preview is for UI only and not saved here.
    updateProduct(updatedProduct);
    onOpenChange(false);
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
            <SheetDescription>Make changes to your product. Click save when you're done.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-6 max-h-[80vh] overflow-y-auto pr-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
             <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
               <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Shoes">Shoes</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} rows={5} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                        <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={field.value}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                    )}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                 <Controller
                    name="stock"
                    control={control}
                    render={({ field }) => (
                        <Input
                        id="stock"
                        type="number"
                        step="1"
                        value={field.value}
                        onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                    )}
                />
                {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="colors">Colors</Label>
                <Input id="colors" {...register('colors')} placeholder="e.g., #FF0000,blue,green" />
                <p className="text-xs text-muted-foreground">Enter comma-separated colors (hex codes or names).</p>
                {errors.colors && <p className="text-sm text-destructive">{errors.colors.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="sizes">Sizes</Label>
                <Input id="sizes" {...register('sizes')} placeholder="e.g., S,M,L,XL" />
                 <p className="text-xs text-muted-foreground">Enter comma-separated sizes.</p>
                {errors.sizes && <p className="text-sm text-destructive">{errors.sizes.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="images">Image</Label>
                <Input id="images" type="file" accept="image/*" onChange={handleImageChange} />
                {(imagePreview || (product.images && product.images.length > 0)) && (
                  <div className="mt-4">
                    <Label>Image Preview</Label>
                    <div className="relative w-full aspect-square mt-2 rounded-md overflow-hidden border">
                       <Image
                        src={imagePreview || product.images[0].url}
                        alt="Product image preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">Image upload is for preview only. The image will not be saved.</p>
             </div>
             <div className="pt-2">
                <Button type="submit" disabled={!isDirty && !imagePreview} className="w-full">Save Product Changes</Button>
             </div>
          </div>
          <SheetFooter className="pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
