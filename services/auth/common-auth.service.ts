// services/auth/common-auth.service.ts
import { apiClient } from '@/lib/api-config';
import type { ApiResponse, RefreshTokenRequest, AuthResponse } from '@/types/auth';

export class CommonAuthService {
  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const data: RefreshTokenRequest = {
        refresh_token: refreshToken,
      };

      const response = await apiClient.post('/auth/refresh-token', data);
      
      // Update tokens
      if (response.data.data?.access_token) {
        this.updateTokens(response.data.data);
      }
      
      return response.data;
    } catch (error: any) {
      // Clear all tokens if refresh fails
      this.clearAllTokens();
      throw {
        message: error.response?.data?.meta?.message || 'Token refresh failed',
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/auth/logout');
      this.clearAllTokens();
      return response.data;
    } catch (error: any) {
      // Clear tokens even if logout API fails
      this.clearAllTokens();
      throw {
        message: error.response?.data?.meta?.message || 'Logout failed',
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
  }

  /**
   * Update stored tokens
   */
  private static updateTokens(authData: Partial<AuthResponse>): void {
    if (typeof window !== 'undefined') {
      if (authData.access_token) {
        localStorage.setItem('access_token', authData.access_token);
      }
      
      if (authData.refresh_token) {
        localStorage.setItem('refresh_token', authData.refresh_token);
      }
      
      if (authData.session_id) {
        localStorage.setItem('session_id', authData.session_id);
      }
      
      if (authData.registration_status) {
        localStorage.setItem('registration_status', authData.registration_status);
      }
      
      if (authData.token_type) {
        localStorage.setItem('token_type', authData.token_type);
      }
      
      if (authData.next_step) {
        localStorage.setItem('next_step', authData.next_step);
      }
    }
  }

  /**
   * Clear all stored tokens and user data
   */
  static clearAllTokens(): void {
    if (typeof window !== 'undefined') {
      const keysToRemove = [
        'access_token',
        'refresh_token',
        'session_id',
        'user_role',
        'registration_status',
        'token_type',
        'next_step',
        'device_id'
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  }

  /**
   * Get current authentication state
   */
  static getAuthState() {
    if (typeof window === 'undefined') {
      return {
        isAuthenticated: false,
        userRole: null,
        registrationStatus: null,
        tokenType: null,
        nextStep: null,
      };
    }

    return {
      isAuthenticated: !!localStorage.getItem('access_token'),
      userRole: localStorage.getItem('user_role'),
      registrationStatus: localStorage.getItem('registration_status'),
      tokenType: localStorage.getItem('token_type'),
      nextStep: localStorage.getItem('next_step'),
    };
  }

  /**
   * Check if user has completed registration
   */
  static isRegistrationComplete(): boolean {
    const registrationStatus = localStorage.getItem('registration_status');
    return registrationStatus === 'complete';
  }

  /**
   * Check if user needs to complete specific step
   */
  static needsStep(step: string): boolean {
    const nextStep = localStorage.getItem('next_step');
    return nextStep === step;
  }
}