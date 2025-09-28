
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
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '../categories/category-provider';
import { addProduct, type ProductFormData } from '@/app/actions/product-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AddProductSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AddProductSheet({ isOpen, onOpenChange }: AddProductSheetProps) {
  const { categories } = useCategories();
  const { toast } = useToast();
  const router = useRouter();

  const [imagePreview1, setImagePreview1] = useState<string | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);
  const [imagePreview3, setImagePreview3] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      originalPrice: undefined,
      stock: 0,
      category: categories[0] || '',
      colors: '',
      sizes: '',
      purchaseLimit: 10,
    },
  });
  
  useEffect(() => {
    if (isOpen) {
      reset({
        name: '',
        description: '',
        price: 0,
        originalPrice: undefined,
        stock: 0,
        category: categories[0] || '',
        colors: '',
        sizes: '',
        purchaseLimit: 10,
        image1: '',
        image2: '',
        image3: '',
      });
      setImagePreview1(null);
      setImagePreview2(null);
      setImagePreview3(null);
    }
  }, [isOpen, reset, categories]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    fieldName: 'image1' | 'image2' | 'image3'
    ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setter(result);
        setValue(fieldName, result);
      };
      reader.readAsDataURL(file);
    } else {
        setter(null);
        setValue(fieldName, '');
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    const result = await addProduct(data);
    if (result.success) {
      toast({
        title: 'Product Added',
        description: `"${result.product?.name}" has been successfully added.`,
      });
      onOpenChange(false);
      window.dispatchEvent(new CustomEvent('product-updated'));
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to add product',
        description: result.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
            <SheetDescription>Fill in the details for the new product.</SheetDescription>
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
                <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                 <Controller
                    name="originalPrice"
                    control={control}
                    render={({ field }) => (
                        <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        value={field.value ?? ''}
                        onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                        placeholder="e.g. 199.99"
                        />
                    )}
                />
                {errors.originalPrice && <p className="text-sm text-destructive">{errors.originalPrice.message}</p>}
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
                        value={field.value || ''}
                        onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))}
                        />
                    )}
                />
                {errors.purchaseLimit && <p className="text-sm text-destructive">{errors.purchaseLimit.message}</p>}
            </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="colors">Colors</Label>
                <Input id="colors" {...register('colors')} placeholder="e.g., Red, Blue, #FF5733" />
                <p className="text-xs text-muted-foreground">Enter comma-separated colors (hex codes or names).</p>
                {errors.colors && <p className="text-sm text-destructive">{errors.colors.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="sizes">Sizes</Label>
                <Input id="sizes" {...register('sizes')} placeholder="e.g., S, M, L, XL" />
                 <p className="text-xs text-muted-foreground">Enter comma-separated sizes.</p>
                {errors.sizes && <p className="text-sm text-destructive">{errors.sizes.message}</p>}
            </div>
             
            <div className="space-y-4 border-t pt-4">
                <Label>Product Images</Label>
                
                <div className="space-y-2">
                    <Label htmlFor="image1">Image 1</Label>
                    <Input id="image1" type="file" accept="image/*" onChange={e => handleImageChange(e, setImagePreview1, 'image1')} />
                    {imagePreview1 && <Image src={imagePreview1} alt="Preview 1" width={100} height={100} className="mt-2 rounded-md object-cover" />}
                    {errors.image1 && <p className="text-sm text-destructive">{errors.image1.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="image2">Image 2</Label>
                    <Input id="image2" type="file" accept="image/*" onChange={e => handleImageChange(e, setImagePreview2, 'image2')} />
                    {imagePreview2 && <Image src={imagePreview2} alt="Preview 2" width={100} height={100} className="mt-2 rounded-md object-cover" />}
                     {errors.image2 && <p className="text-sm text-destructive">{errors.image2.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="image3">Image 3</Label>
                    <Input id="image3" type="file" accept="image/*" onChange={e => handleImageChange(e, setImagePreview3, 'image3')} />
                    {imagePreview3 && <Image src={imagePreview3} alt="Preview 3" width={100} height={100} className="mt-2 rounded-md object-cover" />}
                     {errors.image3 && <p className="text-sm text-destructive">{errors.image3.message}</p>}
                </div>
             </div>


             <div className="pt-2">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Saving...' : 'Save Product'}
                </Button>
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
