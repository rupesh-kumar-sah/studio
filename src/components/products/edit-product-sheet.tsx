
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

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().int().min(0, 'Stock must be a positive integer'),
});

interface EditProductSheetProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EditProductSheet({ product, isOpen, onOpenChange }: EditProductSheetProps) {
  const { updateProduct } = useProducts();
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
      });
    }
  }, [product, isOpen, reset]);


  const onSubmit = (data: z.infer<typeof productSchema>) => {
    const updatedProduct: Product = {
      ...product,
      ...data,
    };
    updateProduct(updatedProduct);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
            <SheetDescription>Make changes to your product. Click save when you're done.</SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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
                <Label>Images</Label>
                <p className="text-sm text-muted-foreground">Image editing is not yet implemented.</p>
             </div>
          </div>
          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!isDirty}>Save Changes</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
