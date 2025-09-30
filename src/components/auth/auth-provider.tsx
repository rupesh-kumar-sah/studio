
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
    avatar: "https://firebasestorage.googleapis.com/v0/b/app-rune-beta.appspot.com/o/rupesh-sah.jpg?alt=media&token=c97480a7-459f-431c-9391-7c9b33c37326",
    password: "rupesh@0123456",
    pin: "12345",
};

interface AuthContextType {
  isOwner: boolean;
  currentUser: User | null;
  owner: User | null;
  isMounted: boolean;
  allUsers: User[];
  reloadAllUsers: () => void;
  isOwnerCredentials: (email: string, pass: string) => boolean;
  verifyOwnerPin: (pin: string) => boolean;
  verifyOwnerPassword: (password: string) => boolean;
  completeOwnerLogin: () => void;
  customerLogin: (email: string, pass: string) => 'success' | 'invalid';
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  updateAvatar: (userId: string, avatar: string) => void;
  updateOwnerDetails: (details: { name: string; phone: string }) => void;
  findUserByEmail: (email: string) => User | undefined;
  resetPassword: (email: string, newPass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [owner, setOwner] = useState<User | null>(ownerDetails);
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
    try {
        const storedOwner = localStorage.getItem('owner');
        if (storedOwner) {
            return JSON.parse(storedOwner);
        }
    } catch (e) {
        console.error("Failed to parse owner from localStorage", e);
    }
    // If no owner in local storage or parsing fails, initialize with default
    localStorage.setItem('owner', JSON.stringify(ownerDetails));
    return ownerDetails;
  }, []);

  const reloadAllUsers = useCallback(() => {
    setAllUsers(loadUsers());
  }, [loadUsers]);

  useEffect(() => {
    const loadedOwner = loadOwner();
    setOwner(loadedOwner);

    const ownerLoggedIn = localStorage.getItem('isOwnerLoggedIn') === 'true';
    if (ownerLoggedIn) {
      setIsOwner(true);
      setOwner(loadedOwner);
    }
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setAllUsers(loadUsers());
    setIsMounted(true);
  }, [loadUsers, loadOwner]);

  const isOwnerCredentials = (email: string, pass: string) => {
    // This function can be called before state is fully hydrated.
    // Check against both the current state and the default hardcoded details.
    const currentOwner = owner || ownerDetails;
    return (email === currentOwner.email && pass === currentOwner.password) ||
           (email === ownerDetails.email && pass === ownerDetails.password);
  };
  
  const verifyOwnerPin = (pin: string) => {
      // The PIN is not user-configurable, so we only need to check against the default.
      // This avoids race conditions with localStorage.
      return pin === ownerDetails.pin;
  }
  
  const verifyOwnerPassword = (password: string) => {
    const currentOwner = owner || ownerDetails;
    return password === currentOwner.password;
  };

  const completeOwnerLogin = () => {
    localStorage.setItem('isOwnerLoggedIn', 'true');
    const currentOwner = loadOwner() || ownerDetails;
    setOwner(currentOwner);
    setIsOwner(true);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const customerLogin = useCallback((email: string, pass: string) => {
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    if (!user || user.password !== pass) {
      return 'invalid';
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
    setIsOwner(false);
    localStorage.removeItem('isOwnerLoggedIn');
    return 'success';
  }, [loadUsers]);

  const signup = useCallback((name: string, email: string, pass: string) => {
    const users = loadUsers();
    const currentOwner = owner || ownerDetails;
    if (users.some(u => u.email === email) || email === currentOwner.email) {
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
  }, [loadUsers, toast, owner]);

  const logout = () => {
    localStorage.removeItem('isOwnerLoggedIn');
    localStorage.removeItem('currentUser');
    setIsOwner(false);
    setCurrentUser(null);
    setOwner(loadOwner()); // Reset owner state to default from localStorage
  };
  
  const updateOwnerDetails = useCallback((details: { name: string; phone: string }) => {
    const ownerData = loadOwner();
    if (ownerData) {
      const updatedOwner = { ...ownerData, ...details };
      setOwner(updatedOwner);
      localStorage.setItem('owner', JSON.stringify(updatedOwner));
    }
  }, [loadOwner]);

  const updateAvatar = useCallback((userId: string, avatar: string) => {
    const ownerData = loadOwner();
    if (isOwner && userId === ownerData?.id) {
        const updatedOwner = { ...ownerData!, avatar };
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
  }, [isOwner, currentUser, loadUsers, loadOwner]);

  const findUserByEmail = useCallback((email: string): User | undefined => {
    const currentOwner = owner || ownerDetails;
    if (email === currentOwner.email) {
      return currentOwner as User;
    }
    const users = loadUsers();
    return users.find(u => u.email === email);
  }, [loadUsers, owner]);

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
      verifyOwnerPassword,
      completeOwnerLogin,
      customerLogin, 
      signup, 
      logout, 
      updateAvatar, 
      updateOwnerDetails,
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
