
import { Logo } from '@/components/shared/logo';
import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-sm">
              Authentic goods from the heart of Nepal. Your one-stop shop for quality clothing, shoes, and accessories.
            </p>
             <div className="mt-2">
                <h4 className="font-semibold mb-2">Contact Us</h4>
                <a href="mailto:rsah0123456@gmail.com" className="text-sm text-muted-foreground hover:text-foreground">
                  <span>📧 rsah0123456@gmail.com</span>
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
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
               <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Nepal E-Mart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
