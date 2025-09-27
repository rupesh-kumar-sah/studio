
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, RefreshCw, Loader2 } from "lucide-react";
import { usePageContent } from "@/hooks/use-page-content";

export default function ShippingReturnsPage() {
  const { content, loading } = usePageContent('shipping-returns');

  if (loading) {
    return (
      <div className="container flex items-center justify-center py-20 text-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Loading Content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Content not found.</h1>
        <p className="text-muted-foreground">This page could not be loaded.</p>
      </div>
    )
  }

  const { title, description, content: { shipping, returns } } = content;

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        <Card>
          <CardHeader className="flex-row items-center gap-3">
             <Truck className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">{shipping.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground" dangerouslySetInnerHTML={{ __html: shipping.content }} />
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-3">
             <RefreshCw className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">{returns.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground" dangerouslySetInnerHTML={{ __html: returns.content }} />
        </Card>
      </div>
    </div>
  );
}
