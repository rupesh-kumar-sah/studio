
import { Product, Review } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) => {
    const img = PlaceHolderImages.find(p => p.id === id);
    if (!img) {
        // Fallback or error
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
      rating: Math.max(1, Math.min(5, Math.round(rating - 1 + (i % 3)))), // Vary rating around the average
      comment: comments[i % comments.length],
      date: new Date(Date.now() - (i * 3 + 2) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return reviews;
};


export const products: Product[] = [
  {
    id: '1',
    name: 'Himalayan Explorer Jacket',
    description: 'A durable, waterproof jacket designed for the adventurous spirit. Perfect for trekking in the Himalayas or navigating the urban jungle.',
    price: 149.99,
    images: [getImage('clothing-1'), getImage('clothing-2'), getImage('clothing-3')],
    category: 'Clothing',
    rating: 4.5,
    reviews: 120,
    detailedReviews: generateReviews('1', 4.5, 5),
    stock: 50,
    colors: ['#2F3A4C', '#8B4513', '#556B2F'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '2',
    name: 'Kathmandu Valley Tee',
    description: 'A soft, comfortable t-shirt featuring a minimalist design inspired by the temples of Kathmandu. Made from 100% organic cotton.',
    price: 29.99,
    images: [getImage('clothing-2'), getImage('clothing-3'), getImage('clothing-4')],
    category: 'Clothing',
    rating: 4.8,
    reviews: 250,
    detailedReviews: generateReviews('2', 4.8, 3),
    stock: 100,
    colors: ['#FFFFFF', '#F0E68C', '#B0C4DE'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: '3',
    name: 'Everest Trekking Boots',
    description: 'High-performance trekking boots with superior grip and ankle support. Waterproof and breathable for maximum comfort on long hikes.',
    price: 199.99,
    images: [getImage('shoe-1'), getImage('shoe-2'), getImage('shoe-4')],
    category: 'Shoes',
    rating: 4.9,
    reviews: 300,
    detailedReviews: generateReviews('3', 4.9, 4),
    stock: 30,
    colors: ['#A0522D', '#000000'],
    sizes: ['8', '9', '10', '11', '12'],
  },
  {
    id: '4',
    name: 'Pokhara Lakeside Loafers',
    description: 'Casual yet stylish loafers, perfect for a stroll by Phewa Lake. Handcrafted from premium Nepali leather.',
    price: 89.99,
    images: [getImage('shoe-3'), getImage('shoe-2'), getImage('shoe-1')],
    category: 'Shoes',
    rating: 4.6,
    reviews: 80,
    detailedReviews: generateReviews('4', 4.6, 2),
    stock: 60,
    colors: ['#D2B48C', '#8B4513'],
    sizes: ['7', '8', '9', '10'],
  },
  {
    id: '5',
    name: 'Artisan Crafted Backpack',
    description: 'A unique backpack made from locally sourced hemp and decorated with traditional patterns. Spacious and durable for everyday use.',
    price: 75.00,
    images: [getImage('accessory-1'), getImage('accessory-3'), getImage('accessory-2')],
    category: 'Accessories',
    rating: 4.7,
    reviews: 150,
    detailedReviews: generateReviews('5', 4.7, 5),
    stock: 40,
    colors: ['Natural'],
    sizes: ['One Size'],
  },
  {
    id: '6',
    name: 'Gorkha Courage Hoodie',
    description: 'A warm and cozy hoodie that embodies the spirit of the Gorkhas. Features a subtle khukuri emblem.',
    price: 59.99,
    images: [getImage('clothing-3'), getImage('clothing-1'), getImage('clothing-4')],
    category: 'Clothing',
    rating: 4.8,
    reviews: 180,
    detailedReviews: generateReviews('6', 4.8, 3),
    stock: 70,
    colors: ['#464646', '#800000'],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '7',
    name: 'Annapurna Circuit Sneakers',
    description: 'Lightweight and breathable sneakers for light trails and city walks. Inspired by the colors of the Annapurna range.',
    price: 119.99,
    images: [getImage('shoe-1'), getImage('shoe-4'), getImage('shoe-3')],
    category: 'Shoes',
    rating: 4.4,
    reviews: 95,
    detailedReviews: generateReviews('7', 4.4, 4),
    stock: 80,
    colors: ['#ADD8E6', '#FFFFFF'],
    sizes: ['8', '9', '10', '11'],
  },
  {
    id: '8',
    name: 'Himalayan Sun-Kissed Scarf',
    description: 'A beautifully woven pashmina scarf to keep you warm. The vibrant colors reflect a Himalayan sunrise.',
    price: 45.00,
    images: [getImage('accessory-3'), getImage('accessory-2'), getImage('accessory-1')],
    category: 'Accessories',
    rating: 4.9,
    reviews: 210,
    detailedReviews: generateReviews('8', 4.9, 2),
    stock: 90,
    colors: ['#FF4500', '#FFD700', '#FF69B4'],
    sizes: ['One Size'],
  },
   {
    id: '9',
    name: 'Chitwan Jungle Trousers',
    description: 'Comfortable and rugged trousers perfect for wildlife safaris or casual wear. Made from durable cotton twill.',
    price: 69.99,
    images: [getImage('clothing-4'), getImage('clothing-2'), getImage('clothing-1')],
    category: 'Clothing',
    rating: 4.3,
    reviews: 75,
    detailedReviews: generateReviews('9', 4.3, 3),
    stock: 65,
    colors: ['#556B2F', '#D2B48C'],
    sizes: ['M', 'L', 'XL', 'XXL'],
  },
  {
    id: '10',
    name: 'Mustang Trail Runners',
    description: 'Trail running shoes designed for the rugged terrain of Upper Mustang. Offer excellent traction and stability.',
    price: 159.99,
    images: [getImage('shoe-4'), getImage('shoe-1'), getImage('shoe-2')],
    category: 'Shoes',
    rating: 4.7,
    reviews: 110,
    detailedReviews: generateReviews('10', 4.7, 1),
    stock: 45,
    colors: ['#483D8B', '#FFA500'],
    sizes: ['9', '10', '11', '12'],
  },
  {
    id: '11',
    name: 'Patan Durbar Square Watch',
    description: 'An elegant timepiece with a dial inspired by the intricate woodwork of Patan Durbar Square. A fusion of tradition and modernity.',
    price: 249.99,
    images: [getImage('accessory-4'), getImage('accessory-2'), getImage('accessory-1')],
    category: 'Accessories',
    rating: 4.8,
    reviews: 60,
    detailedReviews: generateReviews('11', 4.8, 4),
    stock: 25,
    colors: ['#8B4513', '#C0C0C0'],
    sizes: ['One Size'],
  },
  {
    id: '12',
    name: 'Bhaktapur Weave Beanie',
    description: 'A hand-knitted wool beanie from Bhaktapur, known for its traditional weaving. Keeps you warm with a touch of local artistry.',
    price: 24.99,
    images: [getImage('accessory-3'), getImage('accessory-1'), getImage('accessory-2')],
    category: 'Accessories',
    rating: 4.9,
    reviews: 190,
    detailedReviews: generateReviews('12', 4.9, 0),
    stock: 120,
    colors: ['#A0522D', '#2E4053'],
    sizes: ['One Size'],
  }
];

export const initialProducts = products;
