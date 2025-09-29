
'use server';

import type { PageContent } from '@/lib/types';
import allPagesData from '@/lib/page-content.json';

export async function updatePageContent(
  slug: string,
  newContent: PageContent
): Promise<{ success: boolean; data?: PageContent }> {
  console.log(`Server Action: Pretending to update page with slug: ${slug}`);

  const pageIndex = allPagesData.pages.findIndex(
    (p) => p.slug === slug
  );

  if (pageIndex === -1) {
    return { success: false };
  }

  allPagesData.pages[pageIndex] = newContent as any;

  return { success: true, data: newContent };
}
