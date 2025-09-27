
'use client';

import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect } from "react";
import type { User } from "@/lib/types";

export default function AdminCustomersPage() {
  const { allUsers, reloadAllUsers } = useAuth();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'users' && event.newValue !== event.oldValue) {
        reloadAllUsers();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [reloadAllUsers]);

  const customerUsers = allUsers.filter(user => user.email !== "rsah0123456@gmail.com");

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Registered Customers</h1>
        <p className="text-muted-foreground">A list of all customer accounts.</p>
      </div>
      <Card>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customerUsers.length > 0 ? (
                        customerUsers.map((user: User) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-mono text-xs">{user.id}</TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                                No customers have signed up yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
