
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
    pin: "2063",
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
  updateCustomerDetails: (details: { name: string; phone?: string }) => void;
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
    // Check against both state and default details to avoid race conditions on load
    return (email === owner?.email && pass === owner?.password) || 
           (email === ownerDetails.email && pass === ownerDetails.password);
  };
  
  const verifyOwnerPin = (pin: string) => {
    // PIN is not editable, so always check against the constant for reliability.
    return pin === ownerDetails.pin;
  }
  
  const verifyOwnerPassword = (password: string) => {
    // Password is not editable, so always check against the constant for reliability.
    return password === ownerDetails.password;
  };

  const completeOwnerLogin = () => {
    localStorage.setItem('isOwnerLoggedIn', 'true');
    setOwner(ownerDetails); // Use the reliable, hardcoded details
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
    if (users.some(u => u.email === email) || email === owner?.email) {
      return false;
    }
    const newUser: User = { 
        id: Date.now().toString(), 
        name, 
        email, 
        password: pass,
        avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`
    };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
    return true;
  }, [loadUsers, owner?.email]);

  const logout = () => {
    localStorage.removeItem('isOwnerLoggedIn');
    localStorage.removeItem('currentUser');
    setIsOwner(false);
    setCurrentUser(null);
    setOwner(ownerDetails); // Reset owner state to default
  };
  
  const updateOwnerDetails = useCallback((details: { name: string; phone: string }) => {
    if (owner) {
      const updatedOwner = { ...owner, ...details };
      setOwner(updatedOwner);
      localStorage.setItem('owner', JSON.stringify(updatedOwner));
    }
  }, [owner]);
  
  const updateCustomerDetails = useCallback((details: { name: string; phone?: string }) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...details };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      const users = loadUsers();
      const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setAllUsers(updatedUsers);
    }
  }, [currentUser, loadUsers]);

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
    if (email === owner?.email) {
      return owner as User;
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
      updateCustomerDetails,
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
