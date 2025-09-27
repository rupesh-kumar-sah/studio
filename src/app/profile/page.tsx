
'use client';

import { useAuth } from "@/components/auth/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, ShoppingBag, LogIn, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const owner = {
    name: "Rupesh Kumar Sah",
    email: "rsah0123456@gmail.com",
    avatar: "https://github.com/shadcn.png"
};

export default function ProfilePage() {
  const { isOwner, currentUser, isMounted } = useAuth();
  const router = useRouter();

  if (!isMounted) {
    return <div className="container py-12 text-center">Loading profile...</div>;
  }
  
  if (!isOwner && !currentUser) {
    return (
        <div className="container flex flex-col items-center justify-center text-center py-20">
            <Card className="w-full max-w-md p-8">
                 <LogIn className="h-12 w-12 mx-auto text-muted-foreground" />
                <h1 className="text-2xl font-bold mt-4">Please Log In</h1>
                <p className="mt-2 text-muted-foreground">You need to be logged in to view your profile.</p>
                <Button asChild className="mt-6">
                    <Link href="/login">Go to Login</Link>
                </Button>
            </Card>
        </div>
    )
  }

  const user = isOwner ? {
    name: owner.name,
    email: owner.email,
    avatar: owner.avatar,
    title: 'Owner Profile',
    description: 'Account details for the site administrator.',
    role: 'Administrator'
  } : {
    name: currentUser?.name,
    email: currentUser?.email,
    avatar: `https://ui-avatars.com/api/?name=${currentUser?.name?.replace(' ', '+')}&background=random`,
    title: 'My Profile',
    description: 'View and manage your account details.',
    role: 'Customer'
  };

  return (
    <div className="container py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">{user.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                {user.description}
            </p>
        </div>
        <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={user.avatar} alt={user.name || ''} />
                        <AvatarFallback>{user.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl">{user.name}</CardTitle>
                    <CardDescription>{user.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <span className="text-foreground">{user.email}</span>
                        </div>
                    </div>
                     <div className="border-t pt-6 space-y-4">
                        <Button asChild className="w-full" size="lg">
                            <Link href="/orders">
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                {isOwner ? 'View All Customer Orders' : 'View My Orders'}
                            </Link>
                        </Button>
                        {isOwner && (
                            <Button asChild className="w-full" size="lg" variant="secondary">
                                <Link href="/customers">
                                    <Users className="mr-2 h-5 w-5" />
                                    View All Customers
                                </Link>
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
