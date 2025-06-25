// store/types/auth.types.ts
import type { UserRole, RegistrationStatus, TokenType } from '@/types/auth';

// Loading states for different operations
export interface LoadingStates {
  login: boolean;
  register: boolean;
  otpRequest: boolean;
  otpVerify: boolean;
  companyProfile: boolean;
  pinCreate: boolean;
  pinVerify: boolean;
  approvalCheck: boolean;
  logout: boolean;
  refreshToken: boolean;
}

// Error states
export interface ErrorStates {
  login: string | null;
  register: string | null;
  otpRequest: string | null;
  otpVerify: string | null;
  companyProfile: string | null;
  pinCreate: string | null;
  pinVerify: string | null;
  approvalCheck: string | null;
  logout: string | null;
  general: string | null;
}

// User auth state
export interface AuthUser {
  role: UserRole | null;
  registrationStatus: RegistrationStatus | null;
  tokenType: TokenType | null;
  nextStep: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
}

// Temporary data during registration flow
export interface RegistrationTemp {
  phone: string | null;
  email: string | null;
  otp: string | null;
}

// Auth store state
export interface AuthState {
  // User state
  user: AuthUser;
  
  // Registration temporary data
  tempData: RegistrationTemp;
  
  // Loading states
  loading: LoadingStates;
  
  // Error states
  errors: ErrorStates;
  
  // Flags
  isInitialized: boolean;
}