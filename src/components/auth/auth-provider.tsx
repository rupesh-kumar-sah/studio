
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  isOwner: boolean;
  isMounted: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOwner, setIsOwner] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const ownerLoggedIn = localStorage.getItem('isOwnerLoggedIn') === 'true';
    setIsOwner(ownerLoggedIn);
  }, []);

  const login = useCallback((email: string, pass: string) => {
    if (email === "rsah0123456@gmail.com" && pass === "rupesh@0123456") {
      localStorage.setItem('isOwnerLoggedIn', 'true');
      setIsOwner(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('isOwnerLoggedIn');
    setIsOwner(false);
  }, []);

  const value = { isOwner, isMounted, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
