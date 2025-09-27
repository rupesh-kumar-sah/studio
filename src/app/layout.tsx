import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartProvider } from '@/components/cart/cart-provider';
import { ProductProvider } from '@/components/products/product-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { CategoryProvider } from '@/components/categories/category-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Nepal E-Mart',
  description: 'Your one-stop shop for authentic Nepali goods.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <CategoryProvider>
            <ProductProvider>
              <CartProvider>
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <Toaster />
              </CartProvider>
            </ProductProvider>
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
