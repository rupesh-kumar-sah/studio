
'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Order } from '@/app/checkout/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ShoppingBag, CheckCircle, Clock, Trash2, ArrowRight, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminOrdersPage() {
  const [displayOrders, setDisplayOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const loadOrders = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
      storedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setDisplayOrders(storedOrders);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!isMounted) return;
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'orders') {
        loadOrders();
      }
    };
    
    const handleCustomOrderUpdate = () => {
        loadOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('orders-updated', handleCustomOrderUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('orders-updated', handleCustomOrderUpdate);
    };
  }, [isMounted, loadOrders]); 

  const updateOrderStatus = (orderId: string, status: Order['status'], toastTitle: string, toastDescription: string) => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    const updatedOrders = storedOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    window.dispatchEvent(new CustomEvent('orders-updated'));
    toast({ title: toastTitle, description: toastDescription });
  };

  const acceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'confirmed', 'Order Confirmed', `Order #${orderId} has been marked as confirmed.`);
  };

  const rejectPayment = (orderId: string) => {
    updateOrderStatus(orderId, 'payment-issue', 'Payment Rejected', `Order #${orderId} has been marked with a payment issue.`);
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
  
  if (!isMounted) {
    return (
        <div className="container py-12 text-center">
            <p>Loading orders...</p>
        </div>
    );
  }

  if (displayOrders.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
                <CardTitle className="mt-4">No Orders Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">There are currently no orders to display.</p>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Customer Orders</h1>
        <p className="text-muted-foreground">A list of all submitted orders.</p>
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
                        {`${order.customer.firstName} ${order.customer.lastName} • `}
                        {format(new Date(order.date), "PPP p")}
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-4">
                     <p className="font-bold text-xl">Rs.{order.total.toFixed(2)}</p>
                      <div className={cn(
                        "flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                        order.status === 'confirmed' ? "bg-green-100 text-green-800" :
                        order.status === 'pending' ? "bg-amber-100 text-amber-800" :
                        order.status === 'payment-issue' ? "bg-orange-100 text-orange-800" :
                        "bg-red-100 text-red-800"
                        )}>
                        {order.status === 'confirmed' ? <CheckCircle className="h-4 w-4" /> : 
                         order.status === 'pending' ? <Clock className="h-4 w-4" /> :
                         order.status === 'payment-issue' ? <AlertTriangle className="h-4 w-4" /> :
                         <XCircle className="h-4 w-4" />
                        }
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
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
            <CardFooter className="gap-2 bg-secondary p-4 rounded-b-lg">
                {order.status === 'pending' && (
                    <>
                        <Button onClick={() => acceptOrder(order.id)} size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept Order
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => rejectPayment(order.id)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject Payment
                        </Button>
                    </>
                )}
                <Button variant="destructive" onClick={() => openDeleteDialog(order.id)} size="sm">
                   <Trash2 className="mr-2 h-4 w-4" />
                   Delete Order
                </Button>
            </CardFooter>
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
