// hooks/use-admin-auth.ts
import { useAuthStore } from '@/store';
import { useCallback } from 'react';
import type { AdminRegisterRequest, AdminLoginRequest } from '@/types/auth';

/**
 * Administrator specific auth hook
 */
export function useAdminAuth() {
  const store = useAuthStore();

  // Register admin
  const register = useCallback(async (data: AdminRegisterRequest) => {
    try {
      const result = await store.adminRegister(data);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  // Login admin
  const login = useCallback(async (credentials: Omit<AdminLoginRequest, 'device_id'>) => {
    try {
      const result = await store.adminLogin(credentials);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  // Clear specific errors
  const clearRegisterError = useCallback(() => {
    store.clearErrors('register');
  }, [store]);

  const clearLoginError = useCallback(() => {
    store.clearErrors('login');
  }, [store]);

  return {
    // Actions
    register,
    login,

    // Loading states
    isRegistering: store.loading?.register || false,
    isLoggingIn: store.loading?.login || false,

    // Error states
    registerError: store.errors?.register || null,
    loginError: store.errors?.login || null,

    // Error actions
    clearRegisterError,
    clearLoginError,

    // General auth state (from main useAuth hook would be better, but for convenience)
    isAuthenticated: store.user?.isAuthenticated || false,
    isAdmin: store.user?.role === 'administrator',
  };
}