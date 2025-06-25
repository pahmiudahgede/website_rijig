// store/types/auth.actions.ts
import type {
  AdminRegisterRequest,
  AdminLoginRequest,
  CompanyProfileRequest,
  ApiResponse,
  AuthResponse,
  ApprovalStatusResponse,
} from '@/types/auth';

// Administrator actions
export interface AdminActions {
  adminRegister: (data: AdminRegisterRequest) => Promise<ApiResponse>;
  adminLogin: (credentials: Omit<AdminLoginRequest, 'device_id'>) => Promise<ApiResponse<AuthResponse>>;
}

// Pengelola actions
export interface PengelolaActions {
  // Registration flow
  requestOtpRegister: (phone: string) => Promise<ApiResponse>;
  verifyOtpRegister: (phone: string, otp: string) => Promise<ApiResponse<AuthResponse>>;
  createCompanyProfile: (data: CompanyProfileRequest) => Promise<ApiResponse<AuthResponse>>;
  checkApprovalStatus: () => Promise<ApiResponse<ApprovalStatusResponse>>;
  createPin: (pin: string) => Promise<ApiResponse<AuthResponse>>;
  
  // Login flow
  requestOtpLogin: (phone: string) => Promise<ApiResponse>;
  verifyOtpLogin: (phone: string, otp: string) => Promise<ApiResponse<AuthResponse>>;
  verifyPin: (pin: string) => Promise<ApiResponse<AuthResponse>>;
}

// Common actions
export interface CommonActions {
  // Auth management
  logout: () => Promise<void>;
  refreshToken: () => Promise<ApiResponse<AuthResponse>>;
  initializeAuth: () => void;
  
  // State management
  clearErrors: (errorType?: keyof import('./auth.types').ErrorStates) => void;
  setTempData: (data: Partial<import('./auth.types').RegistrationTemp>) => void;
  clearTempData: () => void;
  
  // Utility
  checkAuthStatus: () => boolean;
  getNextStep: () => string | null;
  isRegistrationComplete: () => boolean;
}

// Combined actions interface
export interface AuthActions extends AdminActions, PengelolaActions, CommonActions {}