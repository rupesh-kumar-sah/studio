
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// Define owner details in one place
const ownerDetails = {
    id: '1',
    name: "Rupesh Kumar Sah",
    email: "rsah0123456@gmail.com",
    phone: "9812345678",
    avatar: "https://firebasestorage.googleapis.com/v0/b/app-rune-beta.appspot.com/o/rupesh-sah.jpg?alt=media&token=c97480a7-459f-431c-9391-7c9b33c37326"
};

const OWNER_PASS = "rupesh@0123456";
const OWNER_PIN = "12345";

interface AuthContextType {
  isOwner: boolean;
  currentUser: User | null;
  owner: User | null;
  isMounted: boolean;
  allUsers: User[];
  reloadAllUsers: () => void;
  isOwnerCredentials: (email: string, pass: string) => boolean;
  verifyOwnerPin: (pin: string) => boolean;
  completeOwnerLogin: () => void;
  customerLogin: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updateAvatar: (userId: string, avatar: string) => void;
  findUserByEmail: (email: string) => User | undefined;
  resetPassword: (email: string, newPass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  const loadUsers = useCallback((): User[] => {
    if (typeof window === 'undefined') return [];
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  }, []);
  
  const loadOwner = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const storedOwner = localStorage.getItem('owner');
    if (storedOwner) {
        return JSON.parse(storedOwner);
    }
    // If no owner in local storage, initialize with default
    localStorage.setItem('owner', JSON.stringify(ownerDetails));
    return ownerDetails;
  }, []);

  const reloadAllUsers = useCallback(() => {
    setAllUsers(loadUsers());
  }, [loadUsers]);

  useEffect(() => {
    setIsMounted(true);
    const ownerLoggedIn = localStorage.getItem('isOwnerLoggedIn') === 'true';
    if (ownerLoggedIn) {
      setIsOwner(true);
      setOwner(loadOwner());
    }
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setAllUsers(loadUsers());
  }, [loadUsers, loadOwner]);

  const isOwnerCredentials = (email: string, pass: string) => {
    return email === ownerDetails.email && pass === OWNER_PASS;
  };
  
  const verifyOwnerPin = (pin: string) => {
      return pin === OWNER_PIN;
  }

  const completeOwnerLogin = () => {
    localStorage.setItem('isOwnerLoggedIn', 'true');
    const ownerData = loadOwner();
    setOwner(ownerData);
    setIsOwner(true);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const customerLogin = useCallback((email: string, pass: string) => {
    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      setIsOwner(false);
      setOwner(null);
      localStorage.removeItem('isOwnerLoggedIn');
      return true;
    }
    return false;
  }, [loadUsers]);

  const signup = useCallback((name: string, email: string, pass: string) => {
    const users = loadUsers();
    if (users.some(u => u.email === email) || email === ownerDetails.email) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'An account with this email already exists.',
      });
      return false;
    }
    const newUser: User = { id: Date.now().toString(), name, email, password: pass };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
    return true;
  }, [loadUsers, toast]);

  const logout = useCallback(() => {
    localStorage.removeItem('isOwnerLoggedIn');
    localStorage.removeItem('currentUser');
    setIsOwner(false);
    setCurrentUser(null);
    setOwner(null);
  }, []);

  const updateAvatar = useCallback((userId: string, avatar: string) => {
    if (isOwner && userId === owner?.id) {
        const updatedOwner = { ...owner!, avatar };
        setOwner(updatedOwner);
        localStorage.setItem('owner', JSON.stringify(updatedOwner));
    } else {
        const users = loadUsers();
        const updatedUsers = users.map(u => u.id === userId ? { ...u, avatar } : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setAllUsers(updatedUsers);

        if (currentUser?.id === userId) {
            const updatedCurrentUser = { ...currentUser, avatar };
            setCurrentUser(updatedCurrentUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
        }
    }
  }, [isOwner, owner, currentUser, loadUsers]);

  const findUserByEmail = useCallback((email: string): User | undefined => {
    if (email === ownerDetails.email) {
      return ownerDetails as User;
    }
    const users = loadUsers();
    return users.find(u => u.email === email);
  }, [loadUsers]);

  const resetPassword = useCallback((email: string, newPass: string) => {
    const users = loadUsers();
    let userFound = false;
    const updatedUsers = users.map(u => {
        if (u.email === email) {
            userFound = true;
            return { ...u, password: newPass };
        }
        return u;
    });

    if (userFound) {
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setAllUsers(updatedUsers);
    }
    
    // Note: We don't handle owner password reset here for security.
    // It is assumed to be a manual process.

    return userFound;
  }, [loadUsers]);

  const value = { 
      isOwner, 
      currentUser, 
      owner, 
      isMounted, 
      allUsers, 
      reloadAllUsers, 
      isOwnerCredentials,
      verifyOwnerPin,
      completeOwnerLogin,
      customerLogin, 
      signup, 
      logout, 
      updateAvatar, 
      findUserByEmail,
      resetPassword
  };

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
