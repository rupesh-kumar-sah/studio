import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="container flex items-center justify-center py-20">
      <Card className="w-full max-w-lg text-center">
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
    </div>
  );
}
