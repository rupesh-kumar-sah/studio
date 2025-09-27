
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const { findUserByEmail } = useAuth();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    // In a real app, this would trigger an email service.
    // Here, we just check if the user exists and show a message.
    const userExists = findUserByEmail(data.email);
    
    // We show the same message whether the user exists or not
    // to avoid leaking information about registered emails.
    console.log(`Password reset requested for: ${data.email}. User exists: ${!!userExists}`);
    setSubmitted(true);
  }

  return (
    <>
    <Header />
    <div className="container flex items-center justify-center py-20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            {submitted ? "Check your email inbox" : "Enter your email to reset your password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full">Send Reset Link</Button>
              </form>
            </Form>
          ) : (
             <div className="text-center">
                <p className="text-muted-foreground">If an account with that email exists, we've sent a password reset link to your inbox. Please check your spam folder if you don't see it.</p>
            </div>
          )}
           <div className="mt-6 text-center text-sm">
            Remembered your password?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    <Footer />
    </>
  );
}
