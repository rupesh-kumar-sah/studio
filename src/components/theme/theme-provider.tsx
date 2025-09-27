
'use client';

import React, { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('storeTheme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        const root = document.documentElement;

        if (theme.primary) root.style.setProperty('--primary', theme.primary);
        if (theme.background) root.style.setProperty('--background', theme.background);
        if (theme.accent) {
          root.style.setProperty('--accent', theme.accent);
          root.style.setProperty('--muted', theme.accent);
          root.style.setProperty('--secondary', theme.accent);
        }
        if (theme.ring) root.style.setProperty('--ring', theme.ring);

      } catch (error) {
        console.error("Failed to parse or apply theme from localStorage", error);
      }
    }
  }, []);

  return <>{children}</>;
}
