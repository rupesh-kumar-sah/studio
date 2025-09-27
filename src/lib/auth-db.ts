
'use server';

// This file is a remnant of a previous authentication model and is no longer
// the primary source of truth. The authentication logic has been consolidated
// into `src/components/auth/auth-provider.tsx`, which uses localStorage.

// While some components may still import from this file, the core functions
// here are simplified or deprecated to avoid data inconsistency. For a production
// app, this file would be removed entirely in favor of a proper database and
// API-based authentication system.

import { cookies } from 'next/headers';
import type { User } from '@/lib/types';

// NOTE: This mock store is NOT the source of truth. 
// It's kept for legacy compatibility with `getIsOwner`.
// The actual user data is managed in localStorage via AuthProvider.
const mockUserStore = {
  users: [
    { id: '1', name: 'Rupesh Kumar Sah', email: 'rsah0123456@gmail.com', isOwner: true },
  ],
};

/**
 * Checks if the current user is the owner based on localStorage.
 * This is a simplified check for server components. The primary
 * source of truth is the `useAuth` hook on the client.
 */
export async function getIsOwner(): Promise<boolean> {
  // In a real app with server-side auth, you would verify a session cookie
  // against a database. For this prototype, we're checking a client-set value.
  const cookieStore = cookies();
  const isOwnerCookie = cookieStore.get('isOwnerLoggedIn');
  return isOwnerCookie?.value === 'true';
}

/**
 * @deprecated This function is deprecated. Use the `useAuth` hook on the client-side.
 * It remains for potential legacy use in server components but is not recommended.
 */
export async function getCurrentUser(): Promise<User | null> {
  console.warn("`getCurrentUser` from `auth-db.ts` is deprecated. Use the `useAuth` hook for user data.");
  return null; // Return null to enforce use of client-side provider
}
