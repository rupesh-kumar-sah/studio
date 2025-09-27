
export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: { url: string; alt: string; hint: string }[];
  category: string;
  rating: number;
  reviews: number;
  detailedReviews: Review[];
  stock: number;
  colors: string[];
  sizes: string[];
  purchaseLimit?: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for social logins
};

export type Category = string;

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
