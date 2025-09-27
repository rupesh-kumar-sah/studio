
'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Order } from '@/app/checkout/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { LogIn, ShoppingBag, CheckCircle, Clock, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function OrdersPage() {
  const [displayOrders, setDisplayOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { isOwner, currentUser, isMounted: authIsMounted } = useAuth();
  const { toast } = useToast();
  
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const loadAndFilterOrders = useCallback(() => {
    if (typeof window === 'undefined') return;

    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    storedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (isOwner) {
        setDisplayOrders(storedOrders);
    } else if (currentUser) {
        const customerOrders = storedOrders.filter(order => order.customer.email === currentUser.email);
        setDisplayOrders(customerOrders);
    } else {
        setDisplayOrders([]);
    }
  }, [isOwner, currentUser]);

  useEffect(() => {
    setIsMounted(true);
    if (authIsMounted) {
        loadAndFilterOrders();
    }
  }, [authIsMounted, loadAndFilterOrders]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'orders') {
        loadAndFilterOrders();
      }
    };
    
    const handleCustomOrderUpdate = () => {
        loadAndFilterOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orders-updated', handleCustomOrderUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orders-updated', handleCustomOrderUpdate);
    };
  }, [loadAndFilterOrders]); 

  const acceptOrder = (orderId: string) => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    const updatedOrders = storedOrders.map(order => 
        order.id === orderId ? { ...order, status: 'confirmed' as const } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    window.dispatchEvent(new CustomEvent('orders-updated'));
    toast({
        title: "Order Confirmed",
        description: `Order #${orderId} has been marked as confirmed.`
    });
  };

  const openDeleteDialog = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeletePassword('');
    setDeleteError('');
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (deletePassword === 'rupesh@0123456') {
        if (orderToDelete) {
            const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
            const updatedOrders = storedOrders.filter(o => o.id !== orderToDelete);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            window.dispatchEvent(new CustomEvent('orders-updated'));
            toast({
                variant: 'destructive',
                title: "Order Deleted",
                description: `Order #${orderToDelete} has been successfully deleted.`
            });
            setIsDeleteDialogOpen(false);
            setOrderToDelete(null);
        }
    } else {
        setDeleteError('Incorrect password. Please try again.');
    }
  };
  
  if (!isMounted || !authIsMounted) {
    return (
        <div className="container py-12 text-center">
            <p>Loading orders...</p>
        </div>
    );
  }

  if (!isOwner && !currentUser) {
     return (
        <div className="container flex flex-col items-center justify-center text-center py-20">
            <Card className="w-full max-w-md p-8">
                 <LogIn className="h-12 w-12 mx-auto text-muted-foreground" />
                <h1 className="text-2xl font-bold mt-4">Please Log In</h1>
                <p className="mt-2 text-muted-foreground">You need to be logged in to view your orders.</p>
                <Button asChild className="mt-6">
                    <Link href="/login">Go to Login</Link>
                </Button>
            </Card>
        </div>
    )
  }

  if (displayOrders.length === 0) {
    return (
      <div className="container py-12 text-center">
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
                <CardTitle className="mt-4">No Orders Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{currentUser ? "You haven't placed any orders yet." : "There are currently no orders to display."}</p>
                {currentUser && (
                    <Button asChild className="mt-6">
                        <Link href="/products">Start Shopping</Link>
                    </Button>
                )}
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{isOwner ? "Customer Orders" : "My Orders"}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {isOwner ? "A list of all submitted orders." : "A list of your past orders."}
        </p>
      </div>
      <div className="space-y-6">
        {displayOrders.map((order) => (
          <Card key={order.id}>
             <CardHeader className="flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                    <CardTitle className="text-xl">
                      <Link href={`/orders/${order.id}`} className="hover:underline">
                        Order #{order.id}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                        {isOwner && `${order.customer.firstName} ${order.customer.lastName} • `}
                        {format(new Date(order.date), "PPP p")}
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-4">
                     <p className="font-bold text-xl">Rs.{order.total.toFixed(2)}</p>
                      <div className={cn(
                        "flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                        order.status === 'confirmed' ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                        )}>
                        {order.status === 'confirmed' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        {order.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                     </div>
                </div>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <p className='text-sm text-muted-foreground'>
                {order.items.length} item(s) • Transaction ID: {order.transactionId}
              </p>
              <Button asChild variant="secondary" size="sm">
                <Link href={`/orders/${order.id}`}>
                  View Details <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </CardContent>
            {isOwner && (
                <CardFooter className="gap-2 bg-secondary p-4 rounded-b-lg">
                    {order.status === 'pending' && (
                        <Button onClick={() => acceptOrder(order.id)} size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept Order
                        </Button>
                    )}
                    <Button variant="destructive" onClick={() => openDeleteDialog(order.id)} size="sm">
                       <Trash2 className="mr-2 h-4 w-4" />
                       Delete Order
                    </Button>
                </CardFooter>
            )}
          </Card>
        ))}
      </div>

       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                This action cannot be undone. To permanently delete this order, please enter the admin password.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
                <Label htmlFor="delete-password">Password</Label>
                <Input
                    id="delete-password"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter password..."
                />
                {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>Delete Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
