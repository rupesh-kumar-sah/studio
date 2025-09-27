
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and also offer Cash on Delivery (COD) for certain locations. For digital payments, we support eSewa and Khalti."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking number. You can also view your order status by logging into your account and visiting the 'My Orders' page."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 14-day return policy for unused and unworn items. Please visit our Shipping & Returns page for detailed instructions on how to process a return."
  },
  {
    question: "How long does shipping take?",
    answer: "Shipping within Kathmandu Valley typically takes 1-2 business days. For orders outside the valley, it may take 3-7 business days depending on the location."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within Nepal. We are working on expanding our shipping options to international locations in the future."
  }
];

export default function FaqPage() {
  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find answers to common questions about our products, shipping, and policies.
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
              {faqs.map((faq, index) => (
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
  )
}
