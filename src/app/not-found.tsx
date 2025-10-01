
'use client';

import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="container flex-1 flex items-center justify-center text-center">
        <div className="space-y-4">
          <FileQuestion className="h-24 w-24 mx-auto text-muted-foreground" />
          <h1 className="text-4xl font-bold tracking-tight">404 - Page Not Found</h1>
          <p className="text-xl text-muted-foreground">
            The page you are looking for does not exist.
          </p>
          <Button asChild>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
