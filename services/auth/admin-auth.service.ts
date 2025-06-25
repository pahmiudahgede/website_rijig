// services/auth/admin-auth.service.ts
import { apiClient } from '@/lib/api-config';
import { getDeviceId } from '@/utils/device';
import type {
  ApiResponse,
  AdminRegisterRequest,
  AdminLoginRequest,
  AuthResponse,
} from '@/types/auth';

export class AdminAuthService {
  /**
   * Register new administrator
   */
  static async register(data: AdminRegisterRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/auth/register/admin', data);
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.meta?.message || 'Registration failed',
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
  }

  /**
   * Login administrator
   */
  static async login(credentials: Omit<AdminLoginRequest, 'device_id'>): Promise<ApiResponse<AuthResponse>> {
    try {
      const loginData: AdminLoginRequest = {
        ...credentials,
        device_id: getDeviceId(),
      };

      const response = await apiClient.post('/auth/login/admin', loginData);
      
      // Store tokens after successful login
      if (response.data.data?.access_token) {
        this.storeTokens(response.data.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.meta?.message || 'Login failed',
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
  }

  /**
   * Store authentication tokens
   */
  private static storeTokens(authData: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', authData.access_token);
      localStorage.setItem('refresh_token', authData.refresh_token);
      localStorage.setItem('session_id', authData.session_id);
      localStorage.setItem('user_role', 'administrator');
      localStorage.setItem('registration_status', authData.registration_status);
      
      if (authData.token_type) {
        localStorage.setItem('token_type', authData.token_type);
      }

      // Sync to cookies for middleware
      import('@/utils/auth-sync').then(({ syncAuthToCookies }) => {
        syncAuthToCookies({
          access_token: authData.access_token,
          refresh_token: authData.refresh_token,
          user_role: 'administrator',
          registration_status: authData.registration_status,
          token_type: authData.token_type,
          session_id: authData.session_id,
        });
      });
    }
  }

  /**
   * Clear stored tokens
   */
  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('session_id');
      localStorage.removeItem('user_role');
      localStorage.removeItem('registration_status');
      localStorage.removeItem('token_type');

      // Clear cookies for middleware
      import('@/utils/auth-sync').then(({ clearAuthCookies }) => {
        clearAuthCookies();
      });
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  }

  /**
   * Get current user role
   */
  static getCurrentRole(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('user_role');
  }
}