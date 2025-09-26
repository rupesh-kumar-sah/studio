import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Phone } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="container flex items-center justify-center py-20">
      <div className="w-full max-w-lg">
        <Card className="text-center">
          <CardHeader>
              <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            <CardTitle className="mt-4 text-2xl">Order Successful!</CardTitle>
            <CardDescription>Thank you for your purchase.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We've received your order and will start processing it right away. A confirmation email has been sent to you with the order details.
            </p>
            <Button asChild className="mt-6">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="mt-6">
            <CardHeader className="flex-row items-center gap-3">
                <Phone className="h-6 w-6 text-muted-foreground" />
                <CardTitle className="text-xl">Questions about your order?</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    To confirm your order or for any inquiries, please contact our support team.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
