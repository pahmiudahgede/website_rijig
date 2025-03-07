import api from '@/lib/axios';

export interface LoginRequest {
  roleid: string;
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user_id: string;
  role_name: string;
  token: string;
}

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post('/login', data);

    if (response?.data?.meta?.status === 200 && response?.data?.data) {
      return response.data.data;
    }

    throw new Error(response?.data?.meta?.message || 'Login failed');
  } catch (error: any) {
    console.error('Login error response:', error?.response);

    const message =
      error?.response?.data?.meta?.message ||
      error?.response?.data?.message ||
      error?.message ||
      'Login request failed';

    if (error?.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error(message);
  }
};
