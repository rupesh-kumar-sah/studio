
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Loader2 } from "lucide-react";
import { usePageContent } from "@/hooks/use-page-content";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsOfServicePage() {
  const { content, loading } = usePageContent('terms-of-service');

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

  const { title, description, content: { sections, lastUpdated } } = content;

  return (
    <>
    <Header />
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="flex-row items-center gap-3">
            <ScrollText className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Our Agreement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            {(sections || []).map((section: {title: string, content: string}, index: number) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-foreground text-lg">{section.title}</h3>
                <p>{section.content}</p>
              </div>
            ))}
            <div className="pt-4 text-sm">
                <p>Last updated: {lastUpdated}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    <Footer />
    </>
  );
}
