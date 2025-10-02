
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Order, OrderStatus } from '@/app/checkout/page';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, ArrowUpDown, CheckCircle, Clock, XCircle, AlertTriangle, Trash2, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type SortKey = 'date' | 'customer' | 'total' | 'status';

export function OrdersPageClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const { verifyOwnerPin } = useAuth();

  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePin, setDeletePin] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);


  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);
  
  const updateOrderStatus = (orderId: string, status: Order['status'], toastTitle: string, toastDescription: string) => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
    const updatedOrders = storedOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    window.dispatchEvent(new CustomEvent('orders-updated'));
    toast({ title: toastTitle, description: toastDescription });
  };
  
  const acceptOrder = (orderId: string) => updateOrderStatus(orderId, 'confirmed', 'Order Confirmed', `Order #${orderId} has been marked as confirmed.`);
  const rejectPayment = (orderId: string) => updateOrderStatus(orderId, 'payment-issue', 'Payment Rejected', `Order #${orderId} has been marked with a payment issue.`);

  const openDeleteDialog = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeletePin('');
    setDeleteError('');
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (!orderToDelete) return;
    if (verifyOwnerPin(deletePin)) {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
      const updatedOrders = storedOrders.filter(o => o.id !== orderToDelete);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      window.dispatchEvent(new CustomEvent('orders-updated'));
      toast({ variant: 'destructive', title: "Order Deleted", description: `Order #${orderToDelete} has been successfully deleted.` });
      setIsDeleteDialogOpen(false);
      setOrderToDelete(null);
    } else {
      setDeleteError('Incorrect PIN. Please try again.');
    }
  };

  const openBulkDeleteDialog = () => {
    if(selectedRows.length === 0) return;
    setDeletePin('');
    setDeleteError('');
    setIsBulkDeleteDialogOpen(true);
  }

  const handleBulkDeleteConfirm = () => {
    if (verifyOwnerPin(deletePin)) {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]') as Order[];
      const updatedOrders = storedOrders.filter(o => !selectedRows.includes(o.id));
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      window.dispatchEvent(new CustomEvent('orders-updated'));
      toast({ variant: 'destructive', title: "Orders Deleted", description: `${selectedRows.length} orders have been deleted.` });
      setIsBulkDeleteDialogOpen(false);
      setSelectedRows([]);
    } else {
      setDeleteError('Incorrect PIN. Please try again.');
    }
  }
  
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };
  
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order =>
      `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let valA, valB;
      switch (sortKey) {
        case 'customer':
          valA = `${a.customer.firstName} ${a.customer.lastName}`;
          valB = `${b.customer.firstName} ${b.customer.lastName}`;
          break;
        case 'total':
          valA = a.total;
          valB = b.total;
          break;
        case 'status':
          valA = a.status;
          valB = b.status;
          break;
        case 'date':
        default:
          valA = new Date(a.date).getTime();
          valB = new Date(b.date).getTime();
      }
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [orders, searchTerm, sortKey, sortDirection]);

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-2xl font-semibold">No Orders Found</h3>
        <p className="mt-2 text-muted-foreground">When customers place orders, they will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search by customer or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {selectedRows.length > 0 && (
          <Button variant="destructive" onClick={openBulkDeleteDialog}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({selectedRows.length})
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedRows.length === filteredAndSortedOrders.length && filteredAndSortedOrders.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRows(filteredAndSortedOrders.map(o => o.id));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Order</TableHead>
              <TableHead onClick={() => handleSort('customer')} className="cursor-pointer">
                Customer <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
                Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                Status <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => handleSort('total')} className="text-right cursor-pointer">
                Total <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedOrders.map((order) => (
              <TableRow key={order.id} data-state={selectedRows.includes(order.id) && "selected"}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(order.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRows([...selectedRows, order.id]);
                      } else {
                        setSelectedRows(selectedRows.filter(id => id !== order.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium hover:underline cursor-pointer" onClick={() => router.push(`/orders/${order.id}`)}>
                    #{order.id}
                  </div>
                  <div className="text-xs text-muted-foreground">{order.items.length} items</div>
                </TableCell>
                <TableCell>{order.customer.firstName} {order.customer.lastName}</TableCell>
                <TableCell>{format(new Date(order.date), "PPP")}</TableCell>
                <TableCell>
                  <div className={cn(
                    "flex items-center gap-2 w-fit rounded-full px-2.5 py-0.5 text-xs font-medium",
                    order.status === 'confirmed' ? "bg-green-100 text-green-800" :
                    order.status === 'pending' ? "bg-amber-100 text-amber-800" :
                    order.status === 'payment-issue' ? "bg-orange-100 text-orange-800" :
                    "bg-red-100 text-red-800"
                  )}>
                    {order.status === 'confirmed' && <CheckCircle className="h-3 w-3" />}
                    {order.status === 'pending' && <Clock className="h-3 w-3" />}
                    {order.status === 'payment-issue' && <AlertTriangle className="h-3 w-3" />}
                    {order.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                    {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ') : 'N/A'}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">Rs.{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => router.push(`/orders/${order.id}`)}>
                        View Details
                      </DropdownMenuItem>
                      {order.status === 'pending' && (
                        <>
                          <DropdownMenuItem onClick={() => acceptOrder(order.id)}>Accept Order</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => rejectPayment(order.id)}>Reject Payment</DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(order.id)}>
                        Delete Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. To permanently delete this order, please enter the admin PIN.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="delete-pin">PIN</Label>
            <Input id="delete-pin" type="password" maxLength={5} value={deletePin} onChange={(e) => setDeletePin(e.target.value)} placeholder="Enter 5-digit PIN..." />
            {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteConfirm}>Delete Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk Deletion</DialogTitle>
            <DialogDescription>
              You are about to delete {selectedRows.length} orders. This action cannot be undone. Please enter the admin PIN to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Label htmlFor="bulk-delete-pin">PIN</Label>
            <Input id="bulk-delete-pin" type="password" maxLength={5} value={deletePin} onChange={(e) => setDeletePin(e.target.value)} placeholder="Enter 5-digit PIN..." />
            {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsBulkDeleteDialogOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleBulkDeleteConfirm}>Delete {selectedRows.length} Orders</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
