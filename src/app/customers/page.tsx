
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

export default function CustomersPage() {
  const { isOwner, allUsers, isMounted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isMounted && !isOwner) {
      router.push('/');
    }
  }, [isOwner, isMounted, router]);

  if (!isMounted) {
    return <div className="container py-12 text-center">Loading...</div>;
  }
  
  if (!isOwner) {
    return (
        <div className="container flex flex-col items-center justify-center text-center py-20">
            <Card className="w-full max-w-md p-8">
                 <ShieldAlert className="h-12 w-12 mx-auto text-destructive" />
                <h1 className="text-2xl font-bold mt-4">Access Denied</h1>
                <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
                <Button asChild className="mt-6">
                    <Link href="/">Go to Homepage</Link>
                </Button>
            </Card>
        </div>
    );
  }

  const customerUsers = allUsers.filter(user => user.email !== "rsah0123456@gmail.com");

  return (
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
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
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

