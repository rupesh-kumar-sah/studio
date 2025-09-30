
'use client';

import { Logo } from '@/components/shared/logo';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export function Footer() {
  const pathname = usePathname();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { toast } = useToast();

  // Hide footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && newsletterEmail.includes('@')) {
      // In a real app, this would be an API call.
      // For the prototype, we just show a toast.
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setNewsletterEmail('');
    } else {
      toast({
        variant: 'destructive',
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
    }
  };

  return (
    <footer className="bg-secondary">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-sm">
             Made in Nepal – Shop Smart, Shop Local.
            </p>
             <div className="mt-2 space-y-1">
                <h4 className="font-semibold mb-2">Contact Us</h4>
                <a href="mailto:rsah0123456@gmail.com" className="text-sm text-muted-foreground hover:text-foreground block">
                  rsah0123456@gmail.com
                </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">FAQs</Link></li>
              <li><Link href="/shipping-returns" className="text-sm text-muted-foreground hover:text-foreground">Shipping &amp; Returns</Link></li>
              <li><Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground">Orders</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal &amp; Policies</h3>
            <ul className="space-y-2">
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3">Subscribe to get the latest deals and offers.</p>
             <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-sm items-center space-x-2">
              <Input 
                type="email" 
                placeholder="Email" 
                className="bg-background"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Nepal eMart. All rights reserved.</p>
           <div className="flex space-x-4">
               <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <TikTokIcon className="h-5 w-5" />
                <span className="sr-only">TikTok</span>
              </Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
