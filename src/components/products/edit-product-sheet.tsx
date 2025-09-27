
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { useCategories } from '../categories/category-provider';


const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().min(0, 'Price must be positive').optional(),
  stock: z.number().int().min(0, 'Stock must be a positive integer'),
  category: z.string().min(1, 'Category is required'),
  colors: z.string().min(1, "Please enter at least one color."),
  sizes: z.string().min(1, "Please enter at least one size."),
  purchaseLimit: z.number().int().min(1, 'Limit must be at least 1').optional(),
});

interface EditProductSheetProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditProductSheet({ product, isOpen, onOpenChange }: EditProductSheetProps) {
  const { updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const router = useRouter();
  const [imagePreview1, setImagePreview1] = useState<string | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);
  const [imagePreview3, setImagePreview3] = useState<string | null>(null);

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
      originalPrice: product.originalPrice,
      stock: product.stock,
      category: product.category,
      colors: product.colors.join(','),
      sizes: product.sizes.join(','),
      purchaseLimit: product.purchaseLimit || 10,
    },
  });
  
  React.useEffect(() => {
    if (isOpen) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
        category: product.category,
        colors: product.colors.join(','),
        sizes: product.sizes.join(','),
        purchaseLimit: product.purchaseLimit || 10,
      });
      setImagePreview1(null);
      setImagePreview2(null);
      setImagePreview3(null);
    }
  }, [product, isOpen, reset]);


  const onSubmit = (data: z.infer<typeof productSchema>) => {
    const updatedImages = [...product.images];
    
    if (imagePreview1) updatedImages[0] = { ...updatedImages[0], url: imagePreview1 };
    if (imagePreview2) updatedImages[1] = { ...(updatedImages[1] || { alt: product.name, hint: '' }), url: imagePreview2 };
    if (imagePreview3) updatedImages[2] = { ...(updatedImages[2] || { alt: product.name, hint: '' }), url: imagePreview3 };

    const updatedProduct: Product = {
      ...product,
      ...data,
      originalPrice: data.originalPrice || undefined,
      colors: data.colors.split(',').map(c => c.trim()).filter(Boolean),
      sizes: data.sizes.split(',').map(s => s.trim()).filter(Boolean),
      images: updatedImages,
    };
    
    updateProduct(updatedProduct);
    onOpenChange(false);
  };
  
  const createImageChangeHandler = (setter: React.Dispatch<React.SetStateAction<string | null>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setter(null);
    }
  };

  const handleImageChange1 = createImageChangeHandler(setImagePreview1);
  const handleImageChange2 = createImageChangeHandler(setImagePreview2);
  const handleImageChange3 = createImageChangeHandler(setImagePreview3);

  const handleDelete = () => {
    deleteProduct(product.id);
    onOpenChange(false);
    router.push('/products');
  };

  const hasImagePreviews = imagePreview1 || imagePreview2 || imagePreview3;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
            <SheetDescription>Make changes to your product. Click save when you're done.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-6 max-h-[calc(100vh-12rem)] overflow-y-auto pr-6">
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
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
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
                <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                <Controller
                    name="originalPrice"
                    control={control}
                    render={({ field }) => (
                        <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 199.99"
                        value={field.value || ''}
                        onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                    )}
                />
                {errors.originalPrice && <p className="text-sm text-destructive">{errors.originalPrice.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Discounted Price</Label>
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
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                    <Label htmlFor="purchaseLimit">Purchase Limit</Label>
                    <Controller
                        name="purchaseLimit"
                        control={control}
                        render={({ field }) => (
                            <Input
                            id="purchaseLimit"
                            type="number"
                            step="1"
                            value={field.value}
                            onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                            />
                        )}
                    />
                    {errors.purchaseLimit && <p className="text-sm text-destructive">{errors.purchaseLimit.message}</p>}
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
             
             <div className="space-y-4 border-t pt-4">
                <Label>Product Images</Label>
                <p className="text-xs text-muted-foreground">Upload new images to replace existing ones. Changes are temporary for this session.</p>

                {/* Image 1 */}
                <div className="space-y-2">
                  <Label htmlFor="image1">Image 1 (Primary)</Label>
                  <Input id="image1" type="file" accept="image/*" onChange={handleImageChange1} />
                  <div className="relative w-full aspect-square mt-2 rounded-md overflow-hidden border">
                    <Image
                      key={imagePreview1 || product.images[0]?.url}
                      src={imagePreview1 || product.images[0]?.url || 'https://placehold.co/600x400'}
                      alt="Product image 1 preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Image 2 */}
                <div className="space-y-2">
                  <Label htmlFor="image2">Image 2</Label>
                  <Input id="image2" type="file" accept="image/*" onChange={handleImageChange2} />
                  <div className="relative w-full aspect-square mt-2 rounded-md overflow-hidden border">
                    <Image
                      key={imagePreview2 || product.images[1]?.url}
                      src={imagePreview2 || product.images[1]?.url || 'https://placehold.co/600x400'}
                      alt="Product image 2 preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Image 3 */}
                <div className="space-y-2">
                  <Label htmlFor="image3">Image 3</Label>
                  <Input id="image3" type="file" accept="image/*" onChange={handleImageChange3} />
                  <div className="relative w-full aspect-square mt-2 rounded-md overflow-hidden border">
                    <Image
                      key={imagePreview3 || product.images[2]?.url}
                      src={imagePreview3 || product.images[2]?.url || 'https://placehold.co/600x400'}
                      alt="Product image 3 preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
             </div>
          </div>
          <SheetFooter className="pt-6 border-t flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">Delete Product</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product from the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex sm:justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={!isDirty && !hasImagePreviews}>Save Changes</Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
