// hooks/use-pengelola-auth.ts
import { useAuthStore } from '@/store';
import { useCallback } from 'react';
import type { CompanyProfileRequest } from '@/types/auth';

/**
 * Pengelola specific auth hook
 */
export function usePengelolaAuth() {
  const store = useAuthStore();

  // Registration Flow
  const requestOtpRegister = useCallback(async (phone: string) => {
    try {
      const result = await store.requestOtpRegister(phone);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  const verifyOtpRegister = useCallback(async (phone: string, otp: string) => {
    try {
      const result = await store.verifyOtpRegister(phone, otp);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  const createCompanyProfile = useCallback(async (data: CompanyProfileRequest) => {
    try {
      const result = await store.createCompanyProfile(data);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  const checkApprovalStatus = useCallback(async () => {
    try {
      const result = await store.checkApprovalStatus();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  const createPin = useCallback(async (pin: string) => {
    try {
      const result = await store.createPin(pin);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  // Login Flow
  const requestOtpLogin = useCallback(async (phone: string) => {
    try {
      const result = await store.requestOtpLogin(phone);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  const verifyOtpLogin = useCallback(async (phone: string, otp: string) => {
    try {
      const result = await store.verifyOtpLogin(phone, otp);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  const verifyPin = useCallback(async (pin: string) => {
    try {
      const result = await store.verifyPin(pin);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, [store]);

  // Temp data management
  const setTempPhone = useCallback((phone: string) => {
    store.setTempData({ phone });
  }, [store]);

  const setTempOtp = useCallback((otp: string) => {
    store.setTempData({ otp });
  }, [store]);

  const clearTempData = useCallback(() => {
    store.clearTempData();
  }, [store]);

  // Error clearing
  const clearOtpError = useCallback(() => {
    store.clearErrors('otpRequest');
    store.clearErrors('otpVerify');
  }, [store]);

  const clearCompanyError = useCallback(() => {
    store.clearErrors('companyProfile');
  }, [store]);

  const clearPinError = useCallback(() => {
    store.clearErrors('pinCreate');
    store.clearErrors('pinVerify');
  }, [store]);

  const clearApprovalError = useCallback(() => {
    store.clearErrors('approvalCheck');
  }, [store]);

  // Registration status checks
  const isAwaitingApproval = store.user?.registrationStatus === 'awaiting_approval';
  const isApproved = store.user?.registrationStatus === 'approved';
  const isRegistrationComplete = store.user?.registrationStatus === 'complete';

  return {
    // Registration actions
    requestOtpRegister,
    verifyOtpRegister,
    createCompanyProfile,
    checkApprovalStatus,
    createPin,

    // Login actions
    requestOtpLogin,
    verifyOtpLogin,
    verifyPin,

    // Temp data
    tempData: store.tempData || { phone: null, email: null, otp: null },
    setTempPhone,
    setTempOtp,
    clearTempData,

    // Loading states
    isRequestingOtp: store.loading?.otpRequest || false,
    isVerifyingOtp: store.loading?.otpVerify || false,
    isCreatingCompany: store.loading?.companyProfile || false,
    isCheckingApproval: store.loading?.approvalCheck || false,
    isCreatingPin: store.loading?.pinCreate || false,
    isVerifyingPin: store.loading?.pinVerify || false,

    // Error states
    otpRequestError: store.errors?.otpRequest || null,
    otpVerifyError: store.errors?.otpVerify || null,
    companyError: store.errors?.companyProfile || null,
    approvalError: store.errors?.approvalCheck || null,
    pinCreateError: store.errors?.pinCreate || null,
    pinVerifyError: store.errors?.pinVerify || null,

    // Error clearing
    clearOtpError,
    clearCompanyError,
    clearPinError,
    clearApprovalError,

    // Status checks
    isAwaitingApproval,
    isApproved,
    isRegistrationComplete,
    
    // Registration flow state
    registrationStatus: store.user?.registrationStatus || null,
    nextStep: store.user?.nextStep || null,

    // General auth state
    isAuthenticated: store.user?.isAuthenticated || false,
    isPengelola: store.user?.role === 'pengelola',
  };
}