// components/providers/auth-provider.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { initializeAuthSync, syncCurrentAuthState } from '@/utils/auth-sync';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Provider Component
 * Initializes auth state and syncs with cookies for middleware
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      // Initialize auth state from localStorage
      initializeAuth();
      
      // Initialize auth sync between localStorage and cookies
      initializeAuthSync();
      
      // Sync current state to cookies for middleware
      syncCurrentAuthState();
    }
  }, [initializeAuth, isInitialized]);

  return <>{children}</>;
}