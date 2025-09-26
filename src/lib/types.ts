export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string; alt: string; hint: string }[];
  category: 'Clothing' | 'Shoes' | 'Accessories';
  rating: number;
  reviews: number;
  stock: number;
  colors: string[];
  sizes: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};
