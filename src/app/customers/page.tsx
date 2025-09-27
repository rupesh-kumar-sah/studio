
'use client';

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogIn, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { User } from "@/lib/types";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function CustomersPage() {
  const { isOwner, allUsers, isMounted, reloadAllUsers } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isMounted && !isOwner) {
      router.push('/admin');
    }
  }, [isOwner, isMounted, router]);

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

  if (!isMounted || !isOwner) {
    return <div className="container py-12 text-center">Loading or redirecting...</div>;
  }

  const customerUsers = allUsers.filter(user => user.email !== "rsah0123456@gmail.com");

  return (
    <>
    <Header />
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Registered Customers</h1>
        <p className="mt-2 text-lg text-muted-foreground">A list of all customer accounts.</p>
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
    <Footer />
    </>
  );
}
