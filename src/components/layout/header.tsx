
"use client";

import Link from 'next/link';
import { Search, User, Menu, LayoutDashboard, ShieldCheck, MessageSquare } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartSheet } from '@/components/cart/cart-sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useCategories } from '../categories/category-provider';
import { cn } from '@/lib/utils';
import { SearchDialog } from '../shared/search-dialog';


export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isOwner, currentUser, isMounted, logout, owner } = useAuth();
  const { categories } = useCategories();
  
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/products');
    }
    if (isMobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const renderUserMenu = () => {
    const user = isOwner ? 'owner' : currentUser ? 'customer' : 'none';

    if (user === 'none') {
      return (
        <div className="hidden md:flex items-center space-x-2">
            <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
      );
    }
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isOwner && (
                    <DropdownMenuItem asChild>
                        <Link href="/admin">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Admin Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={isOwner ? "/admin/orders" : "/orders"}>Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
  }

  // Hide header on admin pages
  if (pathname.startsWith('/admin')) {
      return null;
  }

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {isMounted && isOwner && (
          <div className="bg-primary/10 text-primary-foreground">
              <div className="container flex items-center justify-center gap-4 text-sm h-10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="text-primary font-semibold">
                      Welcome, {owner?.name}! You are viewing the site as the owner.
                  </p>
                  <Button asChild variant="secondary" size="sm" className="ml-4 h-7">
                      <Link href="/admin">Go to Dashboard</Link>
                  </Button>
              </div>
          </div>
      )}
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="ml-6 hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link 
            href="/products" 
            className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
          >
            All Products
          </Link>
          {categories.map(category => (
            <Link 
              key={category}
              href={`/products?category=${category}`} 
              className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
            >
              {category}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <div className="hidden lg:block w-full max-w-sm">
            <SearchDialog />
          </div>
          
          <div className="lg:hidden">
            <SearchDialog />
          </div>

          {isMounted && renderUserMenu()}

          <CartSheet />

          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <div className="py-4">
                    <Logo />
                </div>

                 <form onSubmit={handleSearch} className="relative w-full mb-6">
                    <Input 
                        type="search" 
                        name="search" 
                        placeholder="Search products..." 
                        className="pl-10" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </form>

                <nav className="flex flex-col space-y-4">
                    <Link href="/products" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
                    {categories.map(category => (
                       <Link 
                          key={category}
                          href={`/products?category=${category}`} 
                          className="text-lg font-medium" 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {category}
                        </Link>
                    ))}
                </nav>
                <div className="mt-8 border-t pt-6">
                 {isMounted && !isOwner && !currentUser && (
                   <div className="flex flex-col space-y-2">
                      <Button asChild variant="ghost" className="w-full">
                          <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                      </Button>
                      <Button asChild className="w-full">
                          <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                      </Button>
                  </div>
                 )}
                 {isMounted && (isOwner || currentUser) && (
                    <Button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full">Log out</Button>
                 )}
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
