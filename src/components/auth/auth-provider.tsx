
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isOwner: boolean;
  currentUser: User | null;
  isMounted: boolean;
  ownerLogin: (email: string, pass: string) => boolean;
  customerLogin: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  const loadUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('users') || '[]');
  };

  useEffect(() => {
    setIsMounted(true);
    const ownerLoggedIn = localStorage.getItem('isOwnerLoggedIn') === 'true';
    if (ownerLoggedIn) {
      setIsOwner(true);
    }
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const ownerLogin = useCallback((email: string, pass: string) => {
    if (email === "rsah0123456@gmail.com" && pass === "rupesh@0123456") {
      localStorage.setItem('isOwnerLoggedIn', 'true');
      setIsOwner(true);
      setCurrentUser(null); // Clear customer session
      localStorage.removeItem('currentUser');
      return true;
    }
    return false;
  }, []);

  const customerLogin = useCallback((email: string, pass: string) => {
    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      setIsOwner(false);
      localStorage.removeItem('isOwnerLoggedIn');
      return true;
    }
    return false;
  }, []);

  const signup = useCallback((name: string, email: string, pass: string) => {
    const users = loadUsers();
    if (users.some(u => u.email === email)) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'An account with this email already exists.',
      });
      return false;
    }
    const newUser: User = { id: Date.now().toString(), name, email, password: pass };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    return true;
  }, [toast]);

  const logout = useCallback(() => {
    localStorage.removeItem('isOwnerLoggedIn');
    localStorage.removeItem('currentUser');
    setIsOwner(false);
    setCurrentUser(null);
  }, []);

  const value = { isOwner, currentUser, isMounted, ownerLogin, customerLogin, signup, logout };

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
