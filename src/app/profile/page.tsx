
'use client';

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Mail, ShoppingBag, LogIn, Edit, Phone, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ProfilePage() {
  const { isOwner, currentUser, owner, isMounted, updateAvatar, updateOwnerDetails } = useAuth();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // State for avatar
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // State for owner details
  const [ownerName, setOwnerName] = useState(owner?.name || '');
  const [ownerPhone, setOwnerPhone] = useState(owner?.phone || '');


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        setNewAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
      if (isOwner) {
        // Save owner details
        if (owner) {
           updateOwnerDetails({ name: ownerName, phone: ownerPhone });
        }
      }

      if (previewUrl && (currentUser || isOwner)) {
          const userId = isOwner ? owner!.id : currentUser!.id;
          updateAvatar(userId, previewUrl);
      }
      
      toast({
          title: 'Profile Updated',
          description: 'Your new details have been saved.',
      });
      setIsEditDialogOpen(false);
      setNewAvatarFile(null);
      setPreviewUrl(null);
  };

  if (!isMounted) {
    return <div className="container py-12 text-center">Loading profile...</div>;
  }
  
  if (!isOwner && !currentUser) {
    return (
        <>
        <Header />
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
        <Footer />
        </>
    )
  }

  const user = isOwner ? {
    id: owner!.id,
    name: owner!.name,
    email: owner!.email,
    phone: owner!.phone,
    avatar: owner!.avatar,
    title: 'Owner Profile',
    description: 'Account details for the site administrator.',
    role: 'Administrator'
  } : {
    id: currentUser!.id,
    name: currentUser!.name,
    email: currentUser!.email,
    phone: currentUser!.phone,
    avatar: currentUser!.avatar || `https://ui-avatars.com/api/?name=${currentUser?.name?.replace(' ', '+')}&background=random`,
    title: 'My Profile',
    description: 'View and manage your account details.',
    role: 'Customer'
  };

  return (
    <>
    <Header />
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
                     <div className="relative group">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={user.avatar} alt={user.name || ''} />
                            <AvatarFallback>{user.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                    </div>
                    <CardTitle className="text-3xl">{user.name}</CardTitle>
                    <CardDescription>{user.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <span className="text-foreground">{user.email}</span>
                        </div>
                        {isOwner && user.phone && (
                            <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <span className="text-foreground">{user.phone}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4 border-t pt-6">
                    {isOwner ? (
                        <div className="w-full flex flex-col sm:flex-row gap-2">
                             <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Owner Profile</DialogTitle>
                                        <DialogDescription>Update your administrator details.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="ownerName">Full Name</Label>
                                            <Input id="ownerName" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="ownerPhone">Phone Number</Label>
                                            <Input id="ownerPhone" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="avatar-upload">Profile Photo</Label>
                                            <Input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} />
                                        </div>
                                        {previewUrl && (
                                            <div>
                                                <p className="text-sm font-medium mb-2">New Photo Preview:</p>
                                                <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden">
                                                <Image src={previewUrl} alt="New avatar preview" fill className="object-cover" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                        <Button onClick={handleSave}>Save Changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button asChild className="w-full" size="lg">
                                <Link href="/admin">
                                    <LayoutDashboard className="mr-2 h-5 w-5" />
                                    Go to Dashboard
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Button asChild className="w-full" size="lg">
                            <Link href="/orders">
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                View My Orders
                            </Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    </div>
    <Footer />
    </>
  );
}
