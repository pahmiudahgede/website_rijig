"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store";
import {
  initializeAuthSync,
  syncCurrentAuthState,
  debugAuthState
} from "@/utils/auth-sync";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Provider Component
 * Initializes auth state and syncs with cookies for middleware
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, isInitialized } = useAuthStore();
  const [authSyncInitialized, setAuthSyncInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      console.log("🔄 Initializing auth state...");

      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  useEffect(() => {
    if (isInitialized && !authSyncInitialized) {
      console.log("🔄 Initializing auth sync...");

      initializeAuthSync();

      syncCurrentAuthState();

      if (process.env.NODE_ENV === "development") {
        setTimeout(() => {
          debugAuthState();
        }, 100);
      }

      setAuthSyncInitialized(true);
    }
  }, [isInitialized, authSyncInitialized]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isInitialized) {
        console.log("👁️ Tab visible, syncing auth state...");
        syncCurrentAuthState();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isInitialized]);

  return <>{children}</>;
}