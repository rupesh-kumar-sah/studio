
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your privacy is important to us.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="flex-row items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">How We Protect Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">1. Information We Collect</h3>
              <p>We collect information you provide directly to us when you create an account, place an order, or communicate with us. This may include your name, email address, shipping address, and payment information. We do not store your full credit card details.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">2. How We Use Your Information</h3>
              <p>We use the information we collect to process your orders, communicate with you, and improve our services. We may also use your information to send you promotional materials, but you can opt out at any time.</p>
            </div>
             <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">3. Data Sharing</h3>
              <p>We do not sell or rent your personal information to third parties. We may share your information with trusted partners who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">4. Data Security</h3>
              <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.</p>
            </div>
             <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-lg">5. Your Rights</h3>
              <p>You have the right to access, correct, or delete your personal information. You can do this by logging into your account or by contacting our customer support.</p>
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
