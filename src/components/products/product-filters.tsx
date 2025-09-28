
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '../ui/button';
import { useCategories } from '../categories/category-provider';
import { useAuth } from '../auth/auth-provider';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';
import { useRouter } from 'next/navigation';
import { AddProductSheet } from './add-product-sheet';

const newCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

export function ProductFilters({ filters, setFilters, uniqueColors, uniqueSizes }: any) {
  const { categories, addCategory } = useCategories();
  const { isOwner } = useAuth();
  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [isAddProductSheetOpen, setAddProductSheetOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>({
    resolver: zodResolver(newCategorySchema),
  });

  const handleCategoryChange = (category: string) => {
    setFilters({ ...filters, category });
  };
  
  const handlePriceChange = (value: number[]) => {
    setFilters({ ...filters, price: value });
  };

  const handleRatingChange = (value: string) => {
    setFilters({ ...filters, rating: parseInt(value) });
  };

  const handleColorChange = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c: string) => c !== color)
      : [...filters.colors, color];
    setFilters({ ...filters, colors: newColors });
  };

  const handleSizeChange = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s: string) => s !== size)
      : [...filters.sizes, size];
    setFilters({ ...filters, sizes: newSizes });
  };
  
  const handleStockChange = (checked: boolean) => {
    setFilters({ ...filters, inStock: checked });
  };

  const clearFilters = () => {
    setFilters({
      search: filters.search, // Keep search term
      category: 'All',
      price: [0, 300],
      rating: 0,
      colors: [],
      sizes: [],
      inStock: true,
    });
  };

  const handleAddCategory = (data: { name: string }) => {
    if (addCategory(data.name)) {
      reset();
      setCategoryDialogOpen(false);
    }
  };


  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="font-semibold text-base">Category</Label>
            {isOwner && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCategoryDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                </Button>
            )}
          </div>
          <RadioGroup value={filters.category} onValueChange={handleCategoryChange} className="mt-2 space-y-1">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="All" id="cat-All" />
                <Label htmlFor="cat-All" className="font-normal">All</Label>
            </div>
            {categories.map((cat:string) => (
              <div key={cat} className="flex items-center space-x-2">
                <RadioGroupItem value={cat} id={`cat-${cat}`} />
                <Label htmlFor={`cat-${cat}`} className="font-normal">{cat}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <Separator />

        <div>
          <Label className="font-semibold text-base">Stock Status</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox id="in-stock" checked={filters.inStock} onCheckedChange={handleStockChange} />
            <Label htmlFor="in-stock" className="font-normal">In Stock</Label>
          </div>
        </div>

        <Separator />
        
        <div>
          <Label htmlFor="price-range" className="font-semibold text-base">Price Range</Label>
          <Slider
            id="price-range"
            min={0}
            max={300}
            step={10}
            value={filters.price}
            onValueChange={handlePriceChange}
            className="mt-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Rs.{filters.price[0]}</span>
            <span>Rs.{filters.price[1]}</span>
          </div>
        </div>

        <Separator />

        <div>
          <Label className="font-semibold text-base">Colors</Label>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {uniqueColors.filter((c:string) => c !== 'Natural').map((color: string) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${filters.colors.includes(color) ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-muted'}`}
                style={{ backgroundColor: color }}
                aria-label={color}
              />
            ))}
          </div>
        </div>
        
        <Separator />

        <div>
          <Label className="font-semibold text-base">Sizes</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {uniqueSizes.filter((s: string) => s !== 'One Size').map((size: string) => (
              <Button key={size} variant={filters.sizes.includes(size) ? 'default' : 'outline'} onClick={() => handleSizeChange(size)}>
                {size}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <Label className="font-semibold text-base">Rating</Label>
          <RadioGroup value={String(filters.rating)} onValueChange={handleRatingChange} className="mt-2 space-y-1">
            {[4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center space-x-2">
                <RadioGroupItem value={String(star)} id={`rating-${star}`} />
                <Label htmlFor={`rating-${star}`} className="font-normal">{star} stars & up</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
    {isOwner && (
        <Button className="w-full mt-4" onClick={() => setAddProductSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Product
        </Button>
    )}
    <Dialog open={isCategoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Enter the name for the new category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddCategory)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AddProductSheet isOpen={isAddProductSheetOpen} onOpenChange={setAddProductSheetOpen} />
    </>
  );
}
