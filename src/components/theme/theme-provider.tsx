
'use client';

import React, { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedThemeCss = localStorage.getItem('themeCss');
    if (savedThemeCss) {
      try {
        const styleTag = document.createElement('style');
        styleTag.innerHTML = savedThemeCss;
        document.head.appendChild(styleTag);
        
      } catch (error) {
        console.error("Failed to parse or apply theme from localStorage", error);
      }
    }
  }, []);

  return <>{children}</>;
}

    