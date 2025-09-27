
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { HelpCircle, Loader2 } from "lucide-react"
import { usePageContent } from "@/hooks/use-page-content"
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function FaqPage() {
  const { content, loading } = usePageContent('faq');

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

  const { title, description, content: { faqs } } = content;

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

      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="flex-row items-center gap-3">
              <HelpCircle className="h-8 w-8 text-primary" />
             <CardTitle className="text-2xl">Quick Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {(faqs || []).map((faq: {question: string, answer: string}, index: number) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
    <Footer />
    </>
  )
}
