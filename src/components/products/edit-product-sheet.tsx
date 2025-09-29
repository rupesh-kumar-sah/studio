
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import type { Product } from '@/lib/types';
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { useCategories } from '../categories/category-provider';
import { updateProduct, deleteProduct, ProductFormData } from '@/app/actions/product-actions';
import { useToast } from '@/hooks/use-toast';


interface EditProductSheetProps {
  product: Product;
  children: React.ReactNode;
}

export function EditProductSheet({ product, children }: EditProductSheetProps) {
  const { categories } = useCategories();
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const [imagePreview1, setImagePreview1] = useState<string | null>(product.images[0]?.url);
  const [imagePreview2, setImagePreview2] = useState<string | null>(product.images[1]?.url);
  const [imagePreview3, setImagePreview3] = useState<string | null>(product.images[2]?.url);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      category: product.category,
      colors: product.colors.join(','),
      sizes: product.sizes.join(','),
      purchaseLimit: product.purchaseLimit || 10,
      image1: product.images[0]?.url || '',
      image2: product.images[1]?.url || '',
      image3: product.images[2]?.url || '',
    },
  });
  
  React.useEffect(() => {
    if (isOpen) {
      reset({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
        category: product.category,
        colors: product.colors.join(','),
        sizes: product.sizes.join(','),
        purchaseLimit: product.purchaseLimit || 10,
        image1: product.images[0]?.url || '',
        image2: product.images[1]?.url || '',
        image3: product.images[2]?.url || '',
      });
      setImagePreview1(product.images[0]?.url);
      setImagePreview2(product.images[1]?.url);
      setImagePreview3(product.images[2]?.url);
    }
  }, [product, isOpen, reset]);


  const onSubmit = async (data: ProductFormData) => {
    const result = await updateProduct(data);
    if (result.success) {
      toast({
        title: 'Product Updated',
        description: `"${result.product?.name}" has been successfully updated.`,
      });
      setIsOpen(false);
      window.dispatchEvent(new CustomEvent('product-updated'));
    } else {
       toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: result.message || 'An unexpected error occurred.',
      });
    }
  };
  
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
        setValue(fieldName, result, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    const result = await deleteProduct(product.id);
    if (result.success) {
      toast({
        title: 'Product Deleted',
        description: `"${product.name}" has been deleted.`,
      });
      setIsOpen(false);
      window.dispatchEvent(new CustomEvent('product-updated'));
      router.push('/admin/products');
    } else {
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: result.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-lg flex flex-col">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
            <SheetDescription>Make changes to your product. Click save when you're done.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-4 py-6 overflow-y-auto pr-6">
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
                  <Label htmlFor="image1">Image 1 (Primary)</Label>
                  <Input id="image1" type="file" accept="image/*" onChange={e => handleImageChange(e, setImagePreview1, 'image1')} />
                  {imagePreview1 && (
                    <div className="relative w-full aspect-square mt-2 rounded-md overflow-hidden border">
                      <Image src={imagePreview1} alt="Product image 1 preview" fill className="object-cover" />
                    </div>
                  )}
                  {errors.image1 && <p className="text-sm text-destructive">{errors.image1.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image2">Image 2</Label>
                  <Input id="image2" type="file" accept="image/*" onChange={e => handleImageChange(e, setImagePreview2, 'image2')} />
                   {imagePreview2 && (
                    <div className="relative w-full aspect-square mt-2 rounded-md overflow-hidden border">
                      <Image src={imagePreview2} alt="Product image 2 preview" fill className="object-cover" />
                    </div>
                  )}
                   {errors.image2 && <p className="text-sm text-destructive">{errors.image2.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image3">Image 3</Label>
                  <Input id="image3" type="file" accept="image/*" onChange={e => handleImageChange(e, setImagePreview3, 'image3')} />
                  {imagePreview3 && (
                    <div className="relative w-full aspect-square mt-2 rounded-md overflow-hidden border">
                      <Image src={imagePreview3} alt="Product image 3 preview" fill className="object-cover" />
                    </div>
                  )}
                   {errors.image3 && <p className="text-sm text-destructive">{errors.image3.message}</p>}
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
                    This action cannot be undone. This will permanently delete the product.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex sm:justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!isDirty || isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
