'use client';

import React from 'react';
import Sidebar from './Sidebar';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!user) {
      // Re-fetch user profile if lost on refresh
      authAPI.getProfile().then(res => {
        setUser(res.data);
      }).catch(() => {
        // If token is invalid, logout
        router.push('/login');
      });
    }
  }, [isAuthenticated, user, router, setUser]);

  if (!isAuthenticated || (!user && isAuthenticated)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen bg-slate-50 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
