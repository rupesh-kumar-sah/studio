
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, ShoppingCart, Users, LogOut, Home, Shapes, Palette, FileText, MessageSquare } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import Link from 'next/link';

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOwner, isMounted, owner, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isMounted && !isOwner) {
      router.push('/login');
    }
  }, [isMounted, isOwner, router]);


  if (!isMounted || !isOwner) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading app...</p>
        </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/admin" asChild>
                        <Link href="/admin">
                            <LayoutDashboard />
                            Dashboard
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/products" asChild>
                        <Link href="/admin/products">
                            <ShoppingCart />
                            Products
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/orders" asChild>
                         <Link href="/admin/orders">
                            <FileText />
                            Orders
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/messages" asChild>
                         <Link href="/admin/messages">
                            <MessageSquare />
                            Messages
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/categories" asChild>
                        <Link href="/admin/categories">
                            <Shapes />
                            Categories
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/pages" asChild>
                        <Link href="/admin/pages">
                            <FileText />
                            Pages
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/customers" asChild>
                        <Link href="/admin/customers">
                            <Users />
                            Customers
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/admin/theme" asChild>
                        <Link href="/admin/theme">
                            <Palette />
                            Theme
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="flex-col !items-start gap-4">
              <div className="flex items-center gap-2 p-2 w-full">
                  <Avatar className="h-9 w-9">
                      <AvatarImage src={owner?.avatar} />
                      <AvatarFallback>{owner?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                      <p className="font-semibold text-sm truncate">{owner?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{owner?.email}</p>
                  </div>
              </div>
              <div className="w-full">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/" asChild>
                            <Link href="/">
                                <Home />
                                Storefront
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout}>
                            <LogOut />
                            Logout
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
              </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 bg-muted/40">
             <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 md:hidden">
                <SidebarTrigger />
                <Logo />
            </header>
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
