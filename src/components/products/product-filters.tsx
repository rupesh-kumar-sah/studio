import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Button } from '../ui/button';

export function ProductFilters({ filters, setFilters, uniqueColors, uniqueSizes }: any) {

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

  const clearFilters = () => {
    setFilters({
      search: filters.search, // Keep search term
      category: 'All',
      price: [0, 300],
      rating: 0,
      colors: [],
      sizes: [],
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="font-semibold text-base">Category</Label>
          <RadioGroup value={filters.category} onValueChange={handleCategoryChange} className="mt-2 space-y-1">
            {['All', 'Clothing', 'Shoes', 'Accessories'].map(cat => (
              <div key={cat} className="flex items-center space-x-2">
                <RadioGroupItem value={cat} id={`cat-${cat}`} />
                <Label htmlFor={`cat-${cat}`} className="font-normal">{cat}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
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
            <span>${filters.price[0]}</span>
            <span>${filters.price[1]}</span>
          </div>
        </div>

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
  );
}
