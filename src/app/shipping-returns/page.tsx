
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Truck, RefreshCw } from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Shipping & Returns</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Everything you need to know about our shipping process and return policy.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        <Card>
          <CardHeader className="flex-row items-center gap-3">
             <Truck className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Shipping Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We are committed to delivering your order accurately, in good condition, and always on time.</p>
            
            <div>
              <h3 className="font-semibold text-foreground mb-1">Delivery Times</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Inside Kathmandu Valley:</strong> 1-2 business days.</li>
                <li><strong>Outside Kathmandu Valley:</strong> 3-7 business days.</li>
              </ul>
            </div>

             <div>
              <h3 className="font-semibold text-foreground mb-1">Shipping Costs</h3>
              <p>We offer FREE shipping on all orders above Rs. 2000. For orders below this amount, a flat rate of Rs. 100 will be applied.</p>
            </div>
             <div>
              <h3 className="font-semibold text-foreground mb-1">Tracking</h3>
              <p>Once your order is dispatched, you will receive an email with your tracking number, which you can use to follow your package's journey.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-3">
             <RefreshCw className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Return Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We want you to be completely satisfied with your purchase. If you're not, we're here to help.</p>

            <div>
              <h3 className="font-semibold text-foreground mb-1">14-Day Returns</h3>
              <p>You can return any unworn, unwashed, or defective merchandise within 14 days of the order delivery date. All tags must be attached.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-1">How to Return</h3>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Contact our support team with your order ID to initiate a return.</li>
                <li>Package the item securely.</li>
                <li>Our delivery partner will arrange a pickup from your address.</li>
              </ol>
            </div>

             <div>
              <h3 className="font-semibold text-foreground mb-1">Refunds</h3>
              <p>Once we receive and inspect your return, we will process your refund to the original payment method within 5-7 business days.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
