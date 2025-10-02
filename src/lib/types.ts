
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
  cartItemId: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  phone?: string;
};

export type Category = string;

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'payment-issue';

export type ChatMessage = {
  id: string;
  text: string;
  sender: 'customer' | 'owner';
  timestamp: string;
  isRead: boolean;
};

export type Conversation = {
  id: string; // Based on customer ID
  customer: {
    id: string;
    name: string;
    email: string;
  };
  messages: ChatMessage[];
  lastMessageAt: string;
};


export type FAQPage = {
  slug: 'faq';
  title: string;
  description: string;
  content: {
    faqs: { question: string; answer: string }[];
  };
};

export type PolicyPage = {
  slug: 'terms-of-service' | 'privacy-policy';
  title: string;
  description: string;
  content: {
    sections: { title: string; content: string }[];
    lastUpdated: string;
  };
};

export type ShippingPage = {
  slug: 'shipping-returns';
  title: string;
  description: string;
  content: {
    shipping: {
      title: string;
      intro: string;
      deliveryTimes: {
        title: string;
        insideValley: string;
        outsideValley: string;
      };
      costs: {
        title: string;
        content: string;
      };
      tracking: {
        title: string;
        content: string;
      };
    };
    returns: {
      title: string;
      intro: string;
      policy: {
        title: string;
        content: string;
      };
      process: {
        title: string;
        steps: string[];
      };
      refunds: {
        title: string;
        content: string;
      };
    };
  };
};

export type PageContent = FAQPage | PolicyPage | ShippingPage;

    
