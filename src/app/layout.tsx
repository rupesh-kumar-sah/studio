
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/auth-provider';
import { CategoryProvider } from '@/components/categories/category-provider';
import { CartProvider } from '@/components/cart/cart-provider';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ChatWidget } from '@/components/chat/chat-widget';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
const siteTitle = 'Nepal E-Mart';
const siteDescription = 'Your one-stop shop for authentic Nepali goods.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: siteTitle,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1667999164091-af4b99bdde32?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'A beautiful Nepali landscape',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['https://images.unsplash.com/photo-1667999164091-af4b99bdde32?w=1200&h=630&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
            <CartProvider>
              <ThemeProvider>
                <main className="flex-1 flex flex-col">
                  {children}
                </main>
                <ChatWidget />
                <Toaster />
              </ThemeProvider>
            </CartProvider>
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
