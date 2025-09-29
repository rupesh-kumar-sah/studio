
'use server';

import type { PageContent } from '@/lib/types';
import allPagesData from '@/lib/page-content.json';

// THIS IS A MOCK ACTION. IN A REAL APP, THIS WOULD WRITE TO A DATABASE.
// For the prototype, we are just returning the data. The actual update
// happens on the client-side and is stored in localStorage.

export async function updatePageContent(slug: string, newContent: PageContent): Promise<{ success: boolean; data?: PageContent }> {
  console.log(`Server Action: Pretending to update page with slug: ${slug}`);
  
  // Find the page and update it in our "database" (the imported JSON object)
  const pageIndex = allPagesData.pages.findIndex((p: any) => p.slug === slug);

  if (pageIndex === -1) {
    return { success: false };
  }

  // This doesn't actually persist because it's a module-level variable.
  // The client-side localStorage is the source of truth for the prototype.
  allPagesData.pages[pageIndex] = newContent as any;

  return { success: true, data: newContent };
}
