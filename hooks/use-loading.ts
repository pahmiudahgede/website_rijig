// hooks/use-loading.ts
import { useAuthStore } from '@/store';
import { useMemo } from 'react';

/**
 * Hook for managing loading states across the auth system
 */
export function useLoading() {
  const loading = useAuthStore((state) => state.loading || {});

  // Default loading states
  const defaultLoading = {
    login: false,
    register: false,
    otpRequest: false,
    otpVerify: false,
    companyProfile: false,
    pinCreate: false,
    pinVerify: false,
    approvalCheck: false,
    logout: false,
    refreshToken: false,
  };

  // Merge with actual loading states, giving priority to actual values
  const safeLoading = {
    ...defaultLoading,
    ...loading,
  };

  // Derived loading states
  const isAnyLoading = useMemo(() => {
    return Object.values(safeLoading).some(Boolean);
  }, [safeLoading]);

  const isAuthLoading = useMemo(() => {
    return safeLoading.login || safeLoading.logout || safeLoading.refreshToken;
  }, [safeLoading.login, safeLoading.logout, safeLoading.refreshToken]);

  const isRegistrationLoading = useMemo(() => {
    return safeLoading.register || safeLoading.otpRequest || safeLoading.otpVerify || 
           safeLoading.companyProfile || safeLoading.pinCreate;
  }, [safeLoading.register, safeLoading.otpRequest, safeLoading.otpVerify, safeLoading.companyProfile, safeLoading.pinCreate]);

  const isOtpLoading = useMemo(() => {
    return safeLoading.otpRequest || safeLoading.otpVerify;
  }, [safeLoading.otpRequest, safeLoading.otpVerify]);

  const isPinLoading = useMemo(() => {
    return safeLoading.pinCreate || safeLoading.pinVerify;
  }, [safeLoading.pinCreate, safeLoading.pinVerify]);

  return {
    // Individual loading states
    login: safeLoading.login,
    register: safeLoading.register,
    otpRequest: safeLoading.otpRequest,
    otpVerify: safeLoading.otpVerify,
    companyProfile: safeLoading.companyProfile,
    pinCreate: safeLoading.pinCreate,
    pinVerify: safeLoading.pinVerify,
    approvalCheck: safeLoading.approvalCheck,
    logout: safeLoading.logout,
    refreshToken: safeLoading.refreshToken,

    // Derived loading states
    isAnyLoading,
    isAuthLoading,
    isRegistrationLoading,
    isOtpLoading,
    isPinLoading,

    // Helper functions
    isLoading: (operations: (keyof typeof safeLoading)[]) => {
      return operations.some(op => safeLoading[op]);
    },
  };
}

/**
 * Hook for specific loading patterns
 */
export function useLoadingPattern() {
  const { isAnyLoading, isAuthLoading, isRegistrationLoading } = useLoading();

  // Loading messages for different states
  const getLoadingMessage = (operation?: keyof ReturnType<typeof useLoading>) => {
    if (!operation) return 'Loading...';

    const messages: Record<string, string> = {
      login: 'Logging in...',
      register: 'Creating account...',
      logout: 'Logging out...',
      otpRequest: 'Sending OTP...',
      otpVerify: 'Verifying OTP...',
      companyProfile: 'Saving company profile...',
      pinCreate: 'Creating PIN...',
      pinVerify: 'Verifying PIN...',
      approvalCheck: 'Checking approval status...',
      refreshToken: 'Refreshing session...',
      isAnyLoading: 'Processing...',
      isAuthLoading: 'Authenticating...',
      isRegistrationLoading: 'Setting up account...',
      isOtpLoading: 'Processing OTP...',
      isPinLoading: 'Processing PIN...',
    };

    return messages[operation] || 'Loading...';
  };

  return {
    isAnyLoading,
    isAuthLoading,
    isRegistrationLoading,
    getLoadingMessage,
  };
}