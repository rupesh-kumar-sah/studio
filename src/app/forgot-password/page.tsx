
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
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Helper function to generate a random 6-digit code
function createRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('enter-email'); // 'enter-email', 'show-code', 'reset-password'
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [emailToReset, setEmailToReset] = useState('');
  const { findUserByEmail, resetPassword, isOwnerCredentials } = useAuth();
  const { toast } = useToast();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
  });

  async function onEmailSubmit(data: z.infer<typeof emailSchema>) {
    setIsLoading(true);

    if (isOwnerCredentials(data.email, 'any')) {
        toast({ variant: 'destructive', title: 'Action Not Allowed', description: 'Password reset for the owner account is disabled for security.' });
        setGeneratedCode(''); // Ensure no code is set
        setIsLoading(false);
        return;
    }

    const userExists = findUserByEmail(data.email);
    let code = '';

    if (userExists) {
        code = createRandomCode();
        setGeneratedCode(code);
        setEmailToReset(data.email);
    } else {
        // To prevent email enumeration, we don't reveal if the user exists.
        // We still proceed, but no code will be shown and no password can be reset.
        setGeneratedCode(''); 
    }
    
    setStep('show-code');
    setIsLoading(false);
  }

  function onResetSubmit(data: z.infer<typeof resetSchema>) {
    setIsLoading(true);
    // In a real app, you'd re-verify the code with the backend. Here we use the stored one.
    if (data.code === generatedCode && generatedCode !== '') {
        if (resetPassword(emailToReset, data.password)) {
            toast({ title: "Success", description: "Your password has been reset. Please log in." });
            setStep('complete');
        } else {
            toast({ variant: 'destructive', title: "Error", description: "Could not reset password." });
        }
    } else {
        resetForm.setError("code", { type: "manual", message: "Invalid reset code." });
    }
    setIsLoading(false);
  }
  
  const renderStep = () => {
    switch (step) {
      case 'enter-email':
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>Enter your email to reset your password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                  <FormField control={emailForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Send Reset Code"}
                  </Button>
                </form>
              </Form>
              <div className="mt-6 text-center text-sm">
                Remembered your password?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                    Log in
                </Link>
              </div>
            </CardContent>
          </>
        );
      case 'show-code':
        return (
          <>
          <AlertDialog open={true} onOpenChange={() => setStep('reset-password')}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Check Your Inbox (Simulation)</AlertDialogTitle>
                  <AlertDialogDescription>
                    {generatedCode 
                      ? "In a real app, an email would be sent. For this demo, your password reset code is:" 
                      : "If an account with that email exists, a password reset code has been sent. For this demo, we show a popup."
                    }
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {generatedCode && (
                  <div className="my-4 text-center">
                    <p className="text-sm text-muted-foreground">Reset Code</p>
                    <p className="text-3xl font-bold tracking-widest">{generatedCode}</p>
                  </div>
                )}
                <AlertDialogFooter>
                  <AlertDialogAction onClick={() => setStep('reset-password')}>
                    Enter Code & Reset Password
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <CardHeader>
              <CardTitle>Waiting</CardTitle>
              <CardDescription>Awaiting code confirmation...</CardDescription>
            </CardHeader>
            <CardContent><p className="text-center text-muted-foreground">Waiting for code confirmation...</p></CardContent>
          </>
        );
      case 'reset-password':
          return (
             <>
                <CardHeader className="text-center">
                  <CardTitle>Reset Your Password</CardTitle>
                  <CardDescription>Enter the code and your new password.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                       <FormField control={resetForm.control} name="code" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reset Code</FormLabel>
                          <FormControl><Input placeholder="123456" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField control={resetForm.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl><Input type="password" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={resetForm.control} name="confirmPassword" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl><Input type="password" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                         {isLoading ? <Loader2 className="animate-spin" /> : "Reset Password"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
             </>
          );
        case 'complete':
            return (
              <>
                <CardHeader>
                  <CardTitle>Password Reset</CardTitle>
                  <CardDescription>Your password has been successfully changed.</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-lg font-semibold">Password Reset!</p>
                    <p className="text-muted-foreground mt-2">You can now log in with your new password.</p>
                    <Button asChild className="mt-4">
                        <Link href="/login">Go to Login</Link>
                    </Button>
                </CardContent>
              </>
            )
    }
  }


  return (
    <>
    <Header />
    <div className="container flex items-center justify-center py-20">
      <Card className="w-full max-w-md">
        {renderStep()}
      </Card>
    </div>
    <Footer />
    </>
  );
}
