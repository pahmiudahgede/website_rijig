"use client";

import { useAutoRefreshToken } from "@/hooks/useAutoRefreshToken";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useAutoRefreshToken();

  return <>{children}</>;
}
