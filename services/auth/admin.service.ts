import { AxiosResponse } from 'axios';
import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { 
  AdminRegisterData, 
  AdminLoginData, 
  AuthResponseData 
} from '@/types/auth.types';
import { API_ENDPOINTS } from '@/lib/constants';

class AdminAuthService {
  async register(data: AdminRegisterData): Promise<AxiosResponse<ApiResponse>> {
    return axiosInstance.post(API_ENDPOINTS.ADMIN_REGISTER, data);
  }

  async login(data: AdminLoginData): Promise<AxiosResponse<ApiResponse<AuthResponseData>>> {
    return axiosInstance.post(API_ENDPOINTS.ADMIN_LOGIN, data);
  }
}

export const adminAuthService = new AdminAuthService();