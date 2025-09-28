
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Order } from '@/app/checkout/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MessageSquare, CheckCircle, Clock, Trash2, ArrowLeft, AlertTriangle, XCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { isOwner, currentUser } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (id) {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
        const foundOrder = storedOrders.find(o => o.id === id);
        setOrder(foundOrder || null);
    }
  }, [id]);

  const updateOrderStatus = (orderId: string, status: Order['status'], toastTitle: string, toastDescription: string) => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    const updatedOrders = storedOrders.map(o => 
        o.id === orderId ? { ...o, status } : o
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrder(updatedOrders.find(o => o.id === orderId) || null);
    window.dispatchEvent(new CustomEvent('orders-updated'));
    toast({ title: toastTitle, description: toastDescription });
  };
  
  const acceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'confirmed', 'Order Confirmed', `Order #${orderId} has been marked as confirmed.`);
  };

  const rejectPayment = (orderId: string) => {
    updateOrderStatus(orderId, 'payment-issue', 'Payment Rejected', `Order #${orderId} has been marked with a payment issue.`);
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled', 'Order Cancelled', `Order #${orderId} has been cancelled.`);
    setIsCancelDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletePassword === 'rupesh@0123456') {
        if (order) {
            const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
            const updatedOrders = storedOrders.filter(o => o.id !== order.id);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            window.dispatchEvent(new CustomEvent('orders-updated'));
            toast({
                variant: 'destructive',
                title: "Order Deleted",
                description: `Order #${order.id} has been successfully deleted.`
            });
            setIsDeleteDialogOpen(false);
            router.push('/orders');
        }
    } else {
        setDeleteError('Incorrect password. Please try again.');
    }
  };
  
  const openDeleteDialog = () => {
      setDeletePassword('');
      setDeleteError('');
      setIsDeleteDialogOpen(true);
  }

  if (!isMounted) {
    return <div className="container py-12 text-center"><p>Loading order details...</p></div>;
  }

  if (!order) {
    return (
      <>
      <Header />
      <div className="container py-12 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
            <CardTitle className="mt-4">Order Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">The order you are looking for does not exist.</p>
            <Button asChild className="mt-6">
              <Link href="/orders">Back to Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
      </>
    );
  }

  const isOrderOwner = currentUser?.email === order.customer.email;
  const canCancel = (isOwner || isOrderOwner) && order.status === 'pending';

  return (
    <>
    <Header />
    <div className="container py-12">
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
            <Link href={isOwner ? "/admin/orders" : "/orders"}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Orders
            </Link>
        </Button>
        <Card>
            <CardHeader className="flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                    <CardTitle className="text-2xl">Order #{order.id}</CardTitle>
                    <CardDescription>
                        Placed on {format(new Date(order.date), "PPP p")}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                    <p className="font-bold text-2xl">Rs.{order.total.toFixed(2)}</p>
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
            <CardContent className="space-y-6">
                <Separator />
                {order.message && (
                    <div className="p-4 bg-secondary rounded-lg">
                        <h4 className="font-semibold flex items-center gap-2 mb-2">
                            <MessageSquare className="h-5 w-5" />
                            Customer Message
                        </h4>
                        <p className="text-muted-foreground text-sm">{order.message}</p>
                    </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold mb-2">Shipping Details</h3>
                        <div className="text-sm text-muted-foreground">
                            <p><strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}</p>
                            <p><strong>Email:</strong> {order.customer.email}</p>
                            <p><strong>Address:</strong> {order.customer.address}</p>
                            <p>{order.customer.city}, {order.customer.postalCode}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Payment Details</h3>
                        <div className="text-sm text-muted-foreground">
                            <p><strong>Method:</strong> eSewa (Manual)</p>
                            <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                            <p><strong>Status:</strong> <span className={cn("font-medium", order.status === 'confirmed' ? 'text-green-600' : 'text-amber-600')}>{order.status === 'confirmed' ? 'Payment Confirmed' : 'Pending Verification'}</span></p>
                        </div>
                    </div>
                </div>
                <Separator />
                <div>
                    <h3 className="font-semibold mb-4">Items ({order.items.length})</h3>
                    <div className="space-y-3">
                    {order.items.map(item => (
                        <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                <p className="text-sm text-muted-foreground">Size: {item.size}, Color: {item.color}</p>
                            </div>
                            <p className="text-sm font-medium">Rs.{(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </CardContent>
            {(isOwner || canCancel) && (
                <CardFooter className="gap-2 bg-secondary p-4 rounded-b-lg">
                    {isOwner && order.status === 'pending' && (
                        <>
                            <Button onClick={() => acceptOrder(order.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Accept Order
                            </Button>
                            <Button variant="outline" onClick={() => rejectPayment(order.id)}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject Payment
                            </Button>
                        </>
                    )}
                    {canCancel && (
                         <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel Order
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Cancel Order</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to cancel this order? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsCancelDialogOpen(false)}>Back</Button>
                                    <Button variant="destructive" onClick={() => cancelOrder(order.id)}>Confirm Cancellation</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                     {isOwner && (
                        <Button variant="destructive" onClick={openDeleteDialog}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Order
                        </Button>
                     )}
                </CardFooter>
            )}
        </Card>
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
    <Footer />
    </>
  );
}
