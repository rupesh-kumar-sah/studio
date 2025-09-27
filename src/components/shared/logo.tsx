
import { Mountain } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Nepal eMart Home">
      <Mountain className="h-6 w-6 text-primary" />
      <span className="text-lg font-bold">Nepal eMart</span>
    </Link>
  );
}
