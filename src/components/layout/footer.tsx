import { Logo } from '@/components/shared/logo';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Authentic goods from the heart of Nepal.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/products?category=Clothing" className="text-sm text-muted-foreground hover:text-foreground">Clothing</Link></li>
              <li><Link href="/products?category=Shoes" className="text-sm text-muted-foreground hover:text-foreground">Shoes</Link></li>
              <li><Link href="/products?category=Accessories" className="text-sm text-muted-foreground hover:text-foreground">Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">FAQs</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Shipping & Returns</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Nepal E-Mart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
