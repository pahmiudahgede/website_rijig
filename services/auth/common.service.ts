import { AxiosResponse } from 'axios';
import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { API_ENDPOINTS } from '@/lib/constants';

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  registration_status: string;
  registration_progress: number;
  next_step: string;
  session_id: string;
}

class CommonAuthService {
  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AxiosResponse<ApiResponse<RefreshTokenResponse>>> {
    return axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, {
      refresh_token: refreshToken,
    });
  }

  /**
   * Logout user
   */
  async logout(): Promise<AxiosResponse<ApiResponse>> {
    return axiosInstance.post(API_ENDPOINTS.LOGOUT);
  }

  /**
   * Validate token (decode JWT and check expiration)
   */
  validateToken(token: string): { 
    isValid: boolean; 
    payload?: any; 
    isExpired?: boolean; 
  } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { isValid: false };
      }

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp ? payload.exp < currentTime : false;

      return {
        isValid: true,
        payload,
        isExpired
      };
    } catch {
      return { isValid: false };
    }
  }

  /**
   * Check if token needs refresh (expires in next 5 minutes)
   */
  shouldRefreshToken(token: string): boolean {
    const validation = this.validateToken(token);
    if (!validation.isValid || !validation.payload?.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = validation.payload.exp - currentTime;
    
    // Refresh if token expires in next 5 minutes (300 seconds)
    return timeUntilExpiry < 300;
  }
}

export const authCommonService = new CommonAuthService();
