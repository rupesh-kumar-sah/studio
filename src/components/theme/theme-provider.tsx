
'use client';

import React from 'react';

// This provider is a pass-through. The actual theme is now controlled
// by the contents of globals.css, which is updated by a server action.
// We keep the provider in case we want to add client-side theme logic
// in the future (like light/dark mode toggling).
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

    
