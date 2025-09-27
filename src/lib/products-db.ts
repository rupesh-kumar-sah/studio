

import { Product, Review } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
    const img = PlaceHolderImages.find(p => p.id === id);
    if (!img) {
        return { url: 'https://picsum.photos/seed/error/600/800', alt: 'Placeholder', hint: 'placeholder' };
    }
    return { url: img.imageUrl, alt: img.description, hint: img.imageHint };
};

const generateReviews = (productId: string, rating: number, reviewCount: number): Review[] => {
  const reviews: Review[] = [];
  const authors = ['Anjali S.', 'Bikram T.', 'Sunita M.', 'Ramesh P.', 'Sita G.'];
  const comments = [
    "Absolutely love it! The quality is outstanding.",
    "Good product, but could be better.",
    "Exceeded my expectations. Highly recommended!",
    "Decent for the price. Does the job.",
    "Not what I expected. The color looks different in person.",
    "Fantastic! Will definitely buy again from this store.",
    "It's okay. Nothing special.",
    "A must-have item. So glad I found it.",
    "The shipping was faster than I thought. Great service.",
    "Great quality and amazing customer service."
  ];

  for (let i = 0; i < reviewCount; i++) {
    reviews.push({
      id: `${productId}-review-${i + 1}`,
      author: authors[i % authors.length],
      rating: Math.max(1, Math.min(5, Math.round(rating - 1 + (i % 3)))),
      comment: comments[i % comments.length],
      date: new Date(Date.now() - (i * 3 + 2) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return reviews;
};

let productsDB: Product[] = [
    {
    id: '1',
    name: 'Men\'s Explorer Jacket',
    description: 'A durable, waterproof jacket designed for the adventurous spirit. Perfect for trekking in the Himalayas or navigating the urban jungle.',
    price: 119.99,
    originalPrice: 149.99,
    images: [getImage('clothing-1'), getImage('clothing-2'), getImage('clothing-3')],
    category: 'Clothing',
    rating: 4.5,
    reviews: 5,
    detailedReviews: generateReviews('1', 4.5, 5),
    stock: 50,
    colors: ['#2F3A4C', '#8B4513', '#556B2F'],
    sizes: ['S', 'M', 'L', 'XL'],
    purchaseLimit: 10,
  },
  {
    id: '2',
    name: 'Women\'s Valley Tee',
    description: 'A soft, comfortable t-shirt featuring a minimalist design inspired by the temples of Kathmandu. Made from 100% organic cotton.',
    price: 29.99,
    originalPrice: undefined,
    images: [getImage('clothing-2'), getImage('clothing-3'), getImage('clothing-4')],
    category: 'Clothing',
    rating: 4.8,
    reviews: 3,
    detailedReviews: generateReviews('2', 4.8, 3),
    stock: 100,
    colors: ['#FFFFFF', '#F0E68C', '#B0C4DE'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    purchaseLimit: 10,
  },
  {
    id: '3',
    name: 'Unisex Trekking Boots',
    description: 'High-performance trekking boots with superior grip and ankle support. Waterproof and breathable for maximum comfort on long hikes.',
    price: 159.99,
    originalPrice: 199.99,
    images: [getImage('shoe-1'), getImage('shoe-2'), getImage('shoe-4')],
    category: 'Shoes',
    rating: 4.9,
    reviews: 4,
    detailedReviews: generateReviews('3', 4.9, 4),
    stock: 30,
    colors: ['#A0522D', '#000000'],
    sizes: ['8', '9', '10', '11', '12'],
    purchaseLimit: 10,
  },
  {
    id: '4',
    name: 'Junior\'s Lakeside Loafers',
    description: 'Casual yet stylish loafers for kids, perfect for a stroll by Phewa Lake. Handcrafted from premium Nepali materials.',
    price: 89.99,
    originalPrice: undefined,
    images: [getImage('shoe-3'), getImage('shoe-2'), getImage('shoe-1')],
    category: 'Shoes',
    rating: 4.6,
    reviews: 2,
    detailedReviews: generateReviews('4', 4.6, 2),
    stock: 60,
    colors: ['#D2B48C', '#8B4513'],
    sizes: ['7', '8', '9', '10'],
    purchaseLimit: 10,
  },
  {
    id: '5',
    name: 'Artisan Crafted Backpack',
    description: 'A unique backpack made from locally sourced hemp and decorated with traditional patterns. Spacious and durable for everyday use.',
    price: 75.00,
    originalPrice: undefined,
    images: [getImage('accessory-1'), getImage('accessory-3'), getImage('accessory-2')],
    category: 'Accessories',
    rating: 4.7,
    reviews: 5,
    detailedReviews: generateReviews('5', 4.7, 5),
    stock: 40,
    colors: ['Natural'],
    sizes: ['One Size'],
    purchaseLimit: 10,
  },
  {
    id: '6',
    name: 'Men\'s Courage Hoodie',
    description: 'A warm and cozy hoodie that embodies the spirit of the Gorkhas. Features a subtle khukuri emblem.',
    price: 49.99,
    originalPrice: 59.99,
    images: [getImage('clothing-3'), getImage('clothing-1'), getImage('clothing-4')],
    category: 'Clothing',
    rating: 4.8,
    reviews: 3,
    detailedReviews: generateReviews('6', 4.8, 3),
    stock: 70,
    colors: ['#464646', '#800000'],
    sizes: ['S', 'M', 'L', 'XL'],
    purchaseLimit: 10,
  },
  {
    id: '7',
    name: 'Women\'s Circuit Sneakers',
    description: 'Lightweight and breathable sneakers for light trails and city walks. Inspired by the colors of the Annapurna range.',
    price: 119.99,
    originalPrice: undefined,
    images: [getImage('shoe-1'), getImage('shoe-4'), getImage('shoe-3')],
    category: 'Shoes',
    rating: 4.4,
    reviews: 4,
    detailedReviews: generateReviews('7', 4.4, 4),
    stock: 80,
    colors: ['#ADD8E6', '#FFFFFF'],
    sizes: ['8', '9', '10', '11'],
    purchaseLimit: 10,
  },
  {
    id: '8',
    name: 'Sun-Kissed Pashmina Scarf',
    description: 'A beautifully woven pashmina scarf to keep you warm. The vibrant colors reflect a Himalayan sunrise.',
    price: 45.00,
    originalPrice: undefined,
    images: [getImage('accessory-3'), getImage('accessory-2'), getImage('accessory-1')],
    category: 'Accessories',
    rating: 4.9,
    reviews: 2,
    detailedReviews: generateReviews('8', 4.9, 2),
    stock: 90,
    colors: ['#FF4500', '#FFD700', '#FF69B4'],
    sizes: ['One Size'],
    purchaseLimit: 10,
  },
   {
    id: '9',
    name: 'Junior\'s Jungle Trousers',
    description: 'Comfortable and rugged trousers for kids, perfect for adventures or casual wear. Made from durable cotton twill.',
    price: 59.99,
    originalPrice: 69.99,
    images: [getImage('clothing-4'), getImage('clothing-2'), getImage('clothing-1')],
    category: 'Clothing',
    rating: 4.3,
    reviews: 3,
    detailedReviews: generateReviews('9', 4.3, 3),
    stock: 0, 
    colors: ['#556B2F', '#D2B48C'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    purchaseLimit: 10,
  },
  {
    id: '10',
    name: 'Digital Smart Watch',
    description: 'A modern smart watch with fitness tracking and notification features. Long-lasting battery and water-resistant.',
    price: 159.99,
    originalPrice: undefined,
    images: [getImage('accessory-4'), getImage('accessory-2'), getImage('accessory-1')],
    category: 'Electronics',
    rating: 4.7,
    reviews: 1,
    detailedReviews: generateReviews('10', 4.7, 1),
    stock: 45,
    colors: ['#483D8B', '#FFA500'],
    sizes: ['One Size'],
    purchaseLimit: 10,
  },
  {
    id: '11',
    name: 'Classic Analog Watch',
    description: 'An elegant timepiece with a dial inspired by the intricate woodwork of Patan Durbar Square. A fusion of tradition and modernity.',
    price: 249.99,
    originalPrice: undefined,
    images: [getImage('accessory-4'), getImage('accessory-2'), getImage('accessory-1')],
    category: 'Accessories',
    rating: 4.8,
    reviews: 4,
    detailedReviews: generateReviews('11', 4.8, 4),
    stock: 25,
    colors: ['#8B4513', '#C0C0C0'],
    sizes: ['One Size'],
    purchaseLimit: 10,
  },
  {
    id: '12',
    name: 'Wireless Bluetooth Earbuds',
    description: 'High-fidelity wireless earbuds with a long-lasting charging case. Perfect for music lovers and professionals on the go.',
    price: 89.99,
    originalPrice: 99.99,
    images: [getImage('accessory-2'), getImage('accessory-4'), getImage('accessory-1')],
    category: 'Electronics',
    rating: 4.9,
    reviews: 0,
    detailedReviews: generateReviews('12', 4.9, 0),
    stock: 120,
    colors: ['#000000', '#FFFFFF'],
    sizes: ['One Size'],
    purchaseLimit: 10,
  }
];

// ************ DATABASE ACCESS FUNCTIONS ************

// NOTE: In a real app, these would be calls to a database.
// For this prototype, we're using an in-memory array.
// We are also exporting the database itself for use in server actions,
// which is NOT a real-world practice.

export let db = {
  products: productsDB,
};

export const refreshProductCalculations = (product: Product): Product => {
    if (product.detailedReviews && product.detailedReviews.length > 0) {
      const totalRating = product.detailedReviews.reduce((acc, review) => acc + review.rating, 0);
      const newAverage = totalRating / product.detailedReviews.length;
      return { ...product, rating: newAverage, reviews: product.detailedReviews.length };
    }
    return { ...product, rating: 0, reviews: 0 };
  };

export async function getProducts(): Promise<Product[]> {
    return Promise.resolve(db.products);
}

export async function getProductById(id: string): Promise<Product | undefined> {
    return Promise.resolve(db.products.find(p => p.id === id));
}

export async function updateReview(productId: string, reviewId: string, newComment: string, newRating: number): Promise<Product | undefined> {
    const productIndex = db.products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        const productToUpdate = db.products[productIndex];
        const updatedReviews = productToUpdate.detailedReviews.map(r => 
            r.id === reviewId ? { ...r, comment: newComment, rating: newRating } : r
        );
        const updatedProduct = { ...productToUpdate, detailedReviews: updatedReviews };
        const refreshedProduct = refreshProductCalculations(updatedProduct);
        db.products[productIndex] = refreshedProduct;
        return Promise.resolve(refreshedProduct);
    }
    return Promise.resolve(undefined);
}

export async function deleteReview(productId: string, reviewId: string): Promise<Product | undefined> {
    const productIndex = db.products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        const productToUpdate = db.products[productIndex];
        const updatedReviews = productToUpdate.detailedReviews.filter(r => r.id !== reviewId);
        const updatedProduct = { ...productToUpdate, detailedReviews: updatedReviews };
        const refreshedProduct = refreshProductCalculations(updatedProduct);
        db.products[productIndex] = refreshedProduct;
        return Promise.resolve(refreshedProduct);
    }
    return Promise.resolve(undefined);
}

// Renaming for clarity in server actions to avoid confusion
export { updateReview as dbUpdateReview, deleteReview as dbDeleteReview };
