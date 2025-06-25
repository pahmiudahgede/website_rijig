// hooks/use-auth-redirect.ts
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './use-auth';
import type { UserRole } from '@/types/auth';

interface UseAuthRedirectOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
  requireAuth?: boolean;
  requireCompleteRegistration?: boolean;
  allowPartialToken?: boolean;
  redirectIfAuthenticated?: boolean;
}

/**
 * Hook for handling authentication-based redirects
 */
export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const router = useRouter();
  const {
    isAuthenticated,
    userRole,
    isRegistrationComplete,
    hasFullToken,
    hasPartialToken,
    getRedirectPath,
    canAccessRoute,
  } = useAuth();

  const {
    requiredRole,
    redirectTo,
    requireAuth = false,
    requireCompleteRegistration = false,
    allowPartialToken = false,
    redirectIfAuthenticated = false,
  } = options;

  useEffect(() => {
    // Don't redirect if not initialized yet
    if (typeof window === 'undefined') return;

    // Redirect if authenticated but shouldn't be (like login pages)
    if (redirectIfAuthenticated && isAuthenticated) {
      const path = redirectTo || getRedirectPath();
      router.replace(path);
      return;
    }

    // Redirect if authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const path = redirectTo || '/';
      router.replace(path);
      return;
    }

    // Redirect if specific role is required but user has different role
    if (requiredRole && userRole !== requiredRole) {
      const path = redirectTo || getRedirectPath();
      router.replace(path);
      return;
    }

    // Redirect if complete registration is required but user hasn't completed
    if (requireCompleteRegistration && !isRegistrationComplete) {
      const path = redirectTo || getRedirectPath();
      router.replace(path);
      return;
    }

    // Redirect if full token is required but user only has partial token
    if (requireCompleteRegistration && !allowPartialToken && hasPartialToken && !hasFullToken) {
      const path = redirectTo || getRedirectPath();
      router.replace(path);
      return;
    }
  }, [
    isAuthenticated,
    userRole,
    isRegistrationComplete,
    hasFullToken,
    hasPartialToken,
    requiredRole,
    redirectTo,
    requireAuth,
    requireCompleteRegistration,
    allowPartialToken,
    redirectIfAuthenticated,
    router,
    getRedirectPath,
  ]);

  return {
    isAuthenticated,
    userRole,
    isRegistrationComplete,
    hasFullToken,
    hasPartialToken,
    canAccessRoute,
    getRedirectPath,
  };
}

/**
 * Hook specifically for protecting dashboard routes
 */
export function useProtectedRoute(requiredRole?: UserRole) {
  return useAuthRedirect({
    requiredRole,
    requireAuth: true,
    requireCompleteRegistration: true,
    allowPartialToken: false,
  });
}

/**
 * Hook specifically for auth pages (login, register)
 */
export function useAuthPageRedirect(role?: UserRole) {
  return useAuthRedirect({
    redirectIfAuthenticated: true,
    redirectTo: role === 'administrator' 
      ? '/sys-rijig-adminpanel/dashboard' 
      : '/pengelola/dashboard',
  });
}

/**
 * Hook for registration flow pages
 */
export function useRegistrationFlowRedirect() {
  return useAuthRedirect({
    requireAuth: true,
    allowPartialToken: true,
    requireCompleteRegistration: false,
  });
}