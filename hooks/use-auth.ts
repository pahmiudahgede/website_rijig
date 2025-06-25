// hooks/use-auth.ts
import { useAuthStore } from '@/store';
import { useCallback } from 'react';
import type { UserRole } from '@/types/auth';

/**
 * Main auth hook that provides authentication state and utilities
 */
export function useAuth() {
  const store = useAuthStore();

  // Safe access to user state with defaults
  const user = store.user || {
    role: null,
    registrationStatus: null,
    tokenType: null,
    nextStep: null,
    sessionId: null,
    isAuthenticated: false,
  };

  // Derived state
  const isAuthenticated = user.isAuthenticated || false;
  const userRole = user.role;
  const registrationStatus = user.registrationStatus;
  const nextStep = user.nextStep;
  const tokenType = user.tokenType;

  // Auth checks
  const isAdmin = userRole === 'administrator';
  const isPengelola = userRole === 'pengelola';
  const isRegistrationComplete = registrationStatus === 'complete';
  const hasPartialToken = tokenType === 'partial';
  const hasFullToken = tokenType === 'full';

  // Role-based checks
  const canAccessAdminRoutes = isAuthenticated && isAdmin && isRegistrationComplete;
  const canAccessPengelolaRoutes = isAuthenticated && isPengelola && isRegistrationComplete;
  const canAccessAnyDashboard = canAccessAdminRoutes || canAccessPengelolaRoutes;

  // Registration flow checks
  const needsCompanyData = nextStep === 'complete_company_data';
  const needsApproval = nextStep === 'awaiting_admin_approval' || nextStep === 'wait_for_approval';
  const needsPin = nextStep === 'create_pin';
  const needsPinVerification = nextStep === 'verif_pin';

  // Actions
  const logout = useCallback(async () => {
    try {
      await store.logout();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  const refreshToken = useCallback(async () => {
    try {
      await store.refreshToken();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  const clearErrors = useCallback((errorType?: keyof typeof store.errors) => {
    store.clearErrors(errorType);
  }, [store]);

  // Get redirect path based on user state
  const getRedirectPath = useCallback((): string => {
    if (!isAuthenticated) {
      return '/';
    }

    if (isAdmin) {
      return canAccessAdminRoutes ? '/sys-rijig-adminpanel/dashboard' : '/sys-rijig-adminpanel/login';
    }

    if (isPengelola) {
      if (needsCompanyData) return '/pengelola/company';
      if (needsApproval) return '/pengelola/approval';
      if (needsPin) return '/pengelola/pin';
      if (needsPinVerification) return '/pengelola/pin';
      if (canAccessPengelolaRoutes) return '/pengelola/dashboard';
    }

    return '/';
  }, [
    isAuthenticated,
    isAdmin,
    isPengelola,
    canAccessAdminRoutes,
    canAccessPengelolaRoutes,
    needsCompanyData,
    needsApproval,
    needsPin,
    needsPinVerification,
  ]);

  // Check if user can access specific route
  const canAccessRoute = useCallback((route: string, requiredRole?: UserRole): boolean => {
    if (!isAuthenticated) return false;

    // If specific role is required
    if (requiredRole && userRole !== requiredRole) return false;

    // Admin routes
    if (route.startsWith('/sys-rijig-adminpanel')) {
      if (route.includes('/dashboard')) return canAccessAdminRoutes;
      if (route.includes('/login') || route.includes('/register')) return !isAuthenticated || !canAccessAdminRoutes;
      return isAdmin;
    }

    // Pengelola routes
    if (route.startsWith('/pengelola')) {
      if (route.includes('/dashboard')) return canAccessPengelolaRoutes;
      if (route.includes('/login') || route.includes('/register')) return !isAuthenticated || !canAccessPengelolaRoutes;
      return isPengelola || !isAuthenticated; // Allow access to auth pages if not authenticated
    }

    return true;
  }, [isAuthenticated, userRole, canAccessAdminRoutes, canAccessPengelolaRoutes]);

  return {
    // Auth state
    user,
    isAuthenticated,
    userRole,
    registrationStatus,
    nextStep,
    tokenType,

    // Role checks
    isAdmin,
    isPengelola,
    isRegistrationComplete,
    hasPartialToken,
    hasFullToken,

    // Route access checks
    canAccessAdminRoutes,
    canAccessPengelolaRoutes,
    canAccessAnyDashboard,

    // Registration flow checks
    needsCompanyData,
    needsApproval,
    needsPin,
    needsPinVerification,

    // Loading states
    loading: store.loading || {},

    // Error states
    errors: store.errors || {},

    // Utilities
    getRedirectPath,
    canAccessRoute,

    // Actions
    logout,
    refreshToken,
    clearErrors,

    // Store (for advanced usage)
    store,
  };
}