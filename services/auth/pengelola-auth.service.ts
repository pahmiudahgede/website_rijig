// services/auth/pengelola-auth.service.ts
import { apiClient, apiClientForm } from '@/lib/api-config';
import { getDeviceId } from '@/utils/device';
import type {
  ApiResponse,
  PengelolaOtpRequest,
  PengelolaOtpVerifyRequest,
  CompanyProfileRequest,
  PinRequest,
  AuthResponse,
  ApprovalStatusResponse,
} from '@/types/auth';

export class PengelolaAuthService {
  /**
   * Request OTP for registration
   */
  static async requestOtpRegister(phone: string): Promise<ApiResponse> {
    try {
      const data: PengelolaOtpRequest = {
        role_name: 'pengelola',
        phone,
      };

      const response = await apiClient.post('/auth/request-otp/register', data);
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.meta?.message || 'Failed to send OTP',
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
  }

  /**
   * Verify OTP for registration
   */
  static async verifyOtpRegister(phone: string, otp: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const data: PengelolaOtpVerifyRequest = {
        role_name: 'pengelola',
        phone,
        otp,
        device_id: getDeviceId(),
      };

      const response = await apiClient.post('/auth/verif-otp/register', data);
      
      // Store tokens after successful verification
      if (response.data.data?.access_token) {
        this.storeTokens(response.data.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.meta?.message || 'OTP verification failed',
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
  }

  /**
   * Create company profile
   */
  static async createCompanyProfile(data: CompanyProfileRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('companyname', data.companyname);
      formData.append('companyaddress', data.companyaddress);
      formData.append('companyphone', data.companyphone);
      formData.append('companyemail', data.companyemail);
      formData.append('companywebsite', data.companywebsite);
      formData.append('company_logo', data.company_logo);
      formData.append('taxid', data.taxid);
      formData.append('foundeddate', data.foundeddate);
      formData.append('companytype', data.companytype);
      formData.append('companydescription', data.companydescription);

      const response = await apiClientForm.post('/companyprofile/create', formData);
      
      // Update tokens after successful company profile creation
      if (response.data.data?.access_token) {
        this.storeTokens(response.data.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.meta?.message || 'Failed to create company profile',
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
  }

  /**
   * Check approval status
   */
  static async checkApprovalStatus(): Promise<ApiResponse<ApprovalStatusResponse>> {
    try {
      const response = await apiClient.get('/auth/cekapproval');
      
      // Update tokens if approval is complete
      if (response.data.data?.access_token) {
        this.storeTokens(response.data.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.meta?.message || 'Failed to check approval status',
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
  }

  /**
   * Create PIN
   */
  static async createPin(userpin: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const data: PinRequest = { userpin };
      const response = await apiClient.post('/pin/create', data);
      
      // Update tokens after successful PIN creation
      if (response.data.data?.access_token) {
        this.storeTokens(response.data.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.meta?.message || 'Failed to create PIN',
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
  }

  /**
   * Request OTP for login
   */
  static async requestOtpLogin(phone: string): Promise<ApiResponse> {
    try {
      const data: PengelolaOtpRequest = {
        role_name: 'pengelola',
        phone,
      };

      const response = await apiClient.post('/auth/request-otp', data);
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.meta?.message || 'Failed to send OTP',
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
  }

  /**
   * Verify OTP for login
   */
  static async verifyOtpLogin(phone: string, otp: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const data: PengelolaOtpVerifyRequest = {
        role_name: 'pengelola',
        phone,
        otp,
        device_id: getDeviceId(),
      };

      const response = await apiClient.post('/auth/verif-otp', data);
      
      // Store tokens after successful verification
      if (response.data.data?.access_token) {
        this.storeTokens(response.data.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.meta?.message || 'OTP verification failed',
        status: error.response?.status || 500,
        data: error.response?.data,
      };
    }
  }

  /**
   * Verify PIN for login
   */
  static async verifyPin(userpin: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const data: PinRequest = { userpin };
      const response = await apiClient.post('/pin/verif', data);
      
      // Update tokens after successful PIN verification
      if (response.data.data?.access_token) {
        this.storeTokens(response.data.data);
      }
      
      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.meta?.message || 'PIN verification failed',
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
      localStorage.setItem('user_role', 'pengelola');
      localStorage.setItem('registration_status', authData.registration_status);
      
      if (authData.token_type) {
        localStorage.setItem('token_type', authData.token_type);
      }
      
      if (authData.next_step) {
        localStorage.setItem('next_step', authData.next_step);
      }
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
      localStorage.removeItem('next_step');
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
   * Get registration status
   */
  static getRegistrationStatus(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('registration_status');
  }

  /**
   * Get next step
   */
  static getNextStep(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('next_step');
  }
}