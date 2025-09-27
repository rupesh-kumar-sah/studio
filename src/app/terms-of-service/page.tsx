
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Please read these terms carefully before using our service.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="flex-row items-center gap-3">
            <ScrollText className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Our Agreement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">1. Introduction</h3>
              <p>Welcome to Nepal E-Mart. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our service, you agree to be bound by these Terms.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">2. User Accounts</h3>
              <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>
            </div>
             <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">3. Orders and Payments</h3>
              <p>We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order, or other reasons.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">4. Intellectual Property</h3>
              <p>The service and its original content, features, and functionality are and will remain the exclusive property of Nepal E-Mart and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Nepal E-Mart.</p>
            </div>
             <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">5. Limitation of Liability</h3>
              <p>In no event shall Nepal E-Mart, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">6. Changes to Terms</h3>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect.</p>
            </div>
            <div className="pt-4 text-sm">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
