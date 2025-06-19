import { AxiosResponse } from 'axios';
import axiosInstance, { axiosFormData } from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { 
  PengelolaOTPRequest,
  PengelolaOTPVerification,
  CompanyProfileData,
  PINData,
  AuthResponseData
} from '@/types/auth.types';
import { API_ENDPOINTS } from '@/lib/constants';

class PengelolaAuthService {
  /**
   * Request OTP for registration
   */
  async requestOTPRegister(data: PengelolaOTPRequest): Promise<AxiosResponse<ApiResponse>> {
    return axiosInstance.post(API_ENDPOINTS.PENGELOLA_OTP_REGISTER, data);
  }

  /**
   * Verify OTP for registration
   */
  async verifyOTPRegister(data: PengelolaOTPVerification): Promise<AxiosResponse<ApiResponse<AuthResponseData>>> {
    return axiosInstance.post(API_ENDPOINTS.PENGELOLA_OTP_VERIFY_REGISTER, data);
  }

  /**
   * Request OTP for login
   */
  async requestOTPLogin(data: PengelolaOTPRequest): Promise<AxiosResponse<ApiResponse>> {
    return axiosInstance.post(API_ENDPOINTS.PENGELOLA_OTP_LOGIN, data);
  }

  /**
   * Verify OTP for login
   */
  async verifyOTPLogin(data: PengelolaOTPVerification): Promise<AxiosResponse<ApiResponse<AuthResponseData>>> {
    return axiosInstance.post(API_ENDPOINTS.PENGELOLA_OTP_VERIFY_LOGIN, data);
  }

  /**
   * Create company profile
   */
  async createCompanyProfile(data: CompanyProfileData): Promise<AxiosResponse<ApiResponse<AuthResponseData>>> {
    const formData = new FormData();
    
    
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    return axiosFormData.post(API_ENDPOINTS.PENGELOLA_COMPANY, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Check approval status
   */
  async checkApprovalStatus(): Promise<AxiosResponse<ApiResponse<{
    message: string;
    registration_status: string;
    next_step: string;
    access_token?: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
    session_id?: string;
  }>>> {
    return axiosInstance.get(API_ENDPOINTS.PENGELOLA_CHECK_APPROVAL);
  }

  /**
   * Create PIN
   */
  async createPIN(data: PINData): Promise<AxiosResponse<ApiResponse<AuthResponseData>>> {
    return axiosInstance.post(API_ENDPOINTS.PENGELOLA_CREATE_PIN, data);
  }

  /**
   * Verify PIN
   */
  async verifyPIN(data: PINData): Promise<AxiosResponse<ApiResponse<AuthResponseData>>> {
    return axiosInstance.post(API_ENDPOINTS.PENGELOLA_VERIFY_PIN, data);
  }
}

export const pengelolaAuthService = new PengelolaAuthService();