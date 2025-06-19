import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthService } from '@/services';
import { useAuthStore } from '@/store/authStore';
import { AdminRegisterData, AdminLoginData } from '@/types/auth.types';
import { getOrCreateDeviceId } from '@/utils/device';
import { AxiosError } from 'axios';
import { ApiError } from '@/types/api.types';

export const useAdminAuth = () => {
  const router = useRouter();
  const { setUser, setLoading, setError, clearError } = useAuthStore();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleError = useCallback((error: unknown) => {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiError;
      
      if (apiError?.errors) {
        setFieldErrors(apiError.errors);
      }
      
      setError(apiError?.meta?.message || 'Terjadi kesalahan');
    } else {
      setError('Terjadi kesalahan yang tidak diketahui');
    }
  }, [setError]);

  const register = useCallback(async (data: AdminRegisterData) => {
    try {
      setLoading(true);
      clearError();
      setFieldErrors({});
      
      const response = await adminAuthService.register(data);
      
      if (response.data?.meta?.status === 200) {
        // Registration successful, redirect to login
        router.push('/sys-rijig-adminpanel/login');
        return { success: true, message: response.data.meta.message };
      }
      
      return { success: false };
    } catch (error) {
      handleError(error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [router, setLoading, clearError, handleError]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      clearError();
      setFieldErrors({});
      
      const loginData: AdminLoginData = {
        email,
        password,
        device_id: getOrCreateDeviceId(),
      };
      
      const response = await adminAuthService.login(loginData);
      
      if (response.data?.meta?.status === 200 && response.data?.data) {
        const authData = response.data.data;
        
        // Set user in store
        setUser({
          role: 'administrator',
          access_token: authData.access_token,
          refresh_token: authData.refresh_token,
          session_id: authData.session_id,
          registration_status: authData.registration_status,
          device_id: loginData.device_id,
        });
        
        // Redirect to dashboard
        router.push('/sys-rijig-adminpanel/dashboard');
        return { success: true };
      }
      
      return { success: false };
    } catch (error) {
      handleError(error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [router, setLoading, clearError, setUser, handleError]);

  return {
    register,
    login,
    fieldErrors,
    clearFieldErrors: () => setFieldErrors({}),
  };
};