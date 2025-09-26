import { Mountain } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Nepal E-Mart Home">
      <Mountain className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold text-primary-foreground bg-primary px-2 py-1 rounded-md">Nepal E-Mart</span>
    </Link>
  );
}
