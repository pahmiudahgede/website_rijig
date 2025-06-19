import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UseAuthOptions {
  requireAuth?: boolean;
  requireRole?: "administrator" | "pengelola";
  requireFullToken?: boolean;
  redirectTo?: string;
  middleware?: (user: any) => boolean;
}

export const useAuth = (options: UseAuthOptions = {}) => {
  const router = useRouter();
  const { user, logout, isLoading, error, clearError, isInitialized } =
    useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isInitialized) return;

    setIsReady(true);

    if (!options.requireAuth) return;

    if (!user) {
      const redirectPath =
        options.redirectTo ||
        (options.requireRole === "administrator"
          ? "/sys-rijig-adminpanel/login"
          : "/pengelola/login");
      router.push(redirectPath);
      return;
    }

    if (options.requireRole && user.role !== options.requireRole) {
      router.push("/");
      return;
    }

    if (options.middleware && !options.middleware(user)) {
      router.push("/");
      return;
    }

    if (
      options.requireFullToken &&
      user.role === "pengelola" &&
      user.token_type !== "full"
    ) {
      switch (user.registration_status) {
        case "uncomplete":
          router.push("/pengelola/company");
          break;
        case "awaiting_approval":
          router.push("/pengelola/approval");
          break;
        case "approved":
          router.push("/pengelola/pin");
          break;
        default:
          router.push("/pengelola/register");
      }
    }
  }, [user, options, router, isInitialized]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    isReady,
    logout,
    clearError
  };
};
