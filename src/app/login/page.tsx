
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="24px"
        height="24px"
        {...props}
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
        />
        <path
          fill="#FF3D00"
          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
        />
        <path
          fill="#4CAF50"
          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
        />
        <path
          fill="#1976D2"
          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,35.245,44,30.028,44,24C44,22.659,43.862,21.35,43.611,20.083z"
        />
      </svg>
    )
  }

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    // Check for owner credentials
    if (data.email === "rsah0123456@gmail.com" && data.password === "rupesh@0123456") {
      console.log("Owner login successful");
      // In a real app, you'd set some auth state here
      // For this prototype, we'll just redirect.
      toast({ title: "Owner Login Successful", description: "Welcome back, Rupesh!" });
      router.push("/profile");
      // We need to simulate the header state change. A full page reload will do this for the prototype.
      setTimeout(() => window.location.assign('/profile'), 500);
      return;
    }

    console.log("Customer login attempt:", data);
    // Here you would typically call your authentication provider for customers
    toast({ variant: 'destructive', title: "Login Failed", description: "Invalid credentials for customer account." });
  }

  function handleGoogleSignIn() {
    console.log("Signing in with Google...");
    // Here you would trigger the Google sign-in flow
  }

  return (
    <div className="container flex items-center justify-center py-20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Log in to your Nepal E-Mart account</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                    <GoogleIcon className="mr-2" />
                    Sign in with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
            </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                            Forgot?
                        </Link>
                    </div>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full">Log In</Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
