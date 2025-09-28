
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PageContent } from '@/lib/types';
import contentData from '@/lib/page-content.json';

export function usePageContent(slug: string) {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContent = useCallback(() => {
    setLoading(true);
    // In a real app, this would be an API call.
    // For this prototype, we'll read from a static JSON and simulate a network request.
    setTimeout(() => {
      const allPages: PageContent[] = JSON.parse(localStorage.getItem('pageContents') || JSON.stringify(contentData.pages));
      const pageContent = allPages.find(p => p.slug === slug);
      
      if (pageContent) {
        setContent(pageContent);
      } else {
        setContent(null);
      }
      setLoading(false);
    }, 500);
  }, [slug]);

  useEffect(() => {
    loadContent();
    
    const handleStorageChange = () => {
      loadContent();
    };

    window.addEventListener('page-content-updated', handleStorageChange);
    return () => {
      window.removeEventListener('page-content-updated', handleStorageChange);
    };

  }, [loadContent, slug]);

  return { content, loading };
}
