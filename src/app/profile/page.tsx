
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, ShoppingBag } from "lucide-react";
import Link from "next/link";

const owner = {
    name: "Rupesh Kumar Sah",
    email: "rsah0123456@gmail.com",
    phone: "9824812753",
    avatar: "https://github.com/shadcn.png"
};

export default function ProfilePage() {
  return (
    <div className="container py-12">
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Owner Profile</h1>
            <p className="mt-2 text-lg text-muted-foreground">
            Account details for the site administrator.
            </p>
        </div>
        <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={owner.avatar} alt={owner.name} />
                        <AvatarFallback>{owner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl">{owner.name}</CardTitle>
                    <CardDescription>Administrator</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <span className="text-foreground">{owner.email}</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <span className="text-foreground">{owner.phone}</span>
                        </div>
                    </div>
                     <div className="border-t pt-6">
                        <Button asChild className="w-full" size="lg">
                            <Link href="/orders">
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                View All Customer Orders
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
