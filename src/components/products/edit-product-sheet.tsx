
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

  // NOTE: Image uploads are not supported in this prototype.
  // The state logic is here as a placeholder for a real implementation.
  const [imagePreview1, setImagePreview1] = useState<string | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);
  const [imagePreview3, setImagePreview3] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
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
      });
      setImagePreview1(null);
      setImagePreview2(null);
      setImagePreview3(null);
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
      // No need to call router.refresh() here as revalidatePath is used in server action
    } else {
       toast({
        variant: 'destructive',
        title: 'Update Failed',
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

  const handleDelete = async () => {
    const result = await deleteProduct(product.id);
    if (result.success) {
      toast({
        title: 'Product Deleted',
        description: `"${product.name}" has been deleted.`,
      });
      setIsOpen(false);
      router.push('/admin/products');
    } else {
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: result.message || 'An unexpected error occurred.',
      });
    }
  };

  const hasImagePreviews = imagePreview1 || imagePreview2 || imagePreview3;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
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
                <p className="text-xs text-muted-foreground">Image uploads are not supported in this prototype. Existing images will be retained.</p>

                {/* Image 1 */}
                <div className="space-y-2">
                  <Label htmlFor="image1">Image 1 (Primary)</Label>
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
