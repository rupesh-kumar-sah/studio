
'use server';

import { cookies } from 'next/headers';
import type { User } from '@/lib/types';

// In a real app, this would be a database call.
// For this prototype, we use a mock store.
const mockUserStore = {
  users: [
    { id: '1', name: 'Rupesh Kumar Sah', email: 'rsah0123456@gmail.com', password: 'rupesh@0123456', isOwner: true },
    { id: '2', name: 'Test Customer', email: 'customer@test.com', password: 'password', isOwner: false },
  ] as (User & { password?: string; isOwner?: boolean })[],
};

export async function getIsOwner(): Promise<boolean> {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) {
    return false;
  }
  const user = mockUserStore.users.find(u => u.id === userId);
  return user?.isOwner || false;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) {
    return null;
  }
  const user = mockUserStore.users.find(u => u.id === userId);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}
