
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
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { useCategories } from '../categories/category-provider';
import { addProduct, ProductFormData } from '@/app/actions/product-actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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
  
  React.useEffect(() => {
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
      });
      setImagePreview1(null);
      setImagePreview2(null);
      setImagePreview3(null);
    }
  }, [isOpen, reset, categories]);

  const onSubmit = async (data: ProductFormData) => {
    const result = await addProduct(data);
    if (result.success) {
      toast({
        title: 'Product Added',
        description: `"${result.product?.name}" has been successfully added.`,
      });
      onOpenChange(false);
      // No need to call router.refresh() here as revalidatePath is used in server action
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to add product',
        description: result.message || 'An unexpected error occurred.',
      });
    }
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
                        value={field.value || ''}
                        onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
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
                <p className="text-xs text-muted-foreground">Image uploads are not supported in this prototype. Placeholders will be used.</p>
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
