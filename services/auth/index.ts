// services/auth/index.ts
export { AdminAuthService } from './admin-auth.service';
export { PengelolaAuthService } from './pengelola-auth.service';
export { CommonAuthService } from './common-auth.service';

// Re-export types for convenience
export type {
  ApiResponse,
  AdminRegisterRequest,
  AdminLoginRequest,
  PengelolaOtpRequest,
  PengelolaOtpVerifyRequest,
  CompanyProfileRequest,
  PinRequest,
  AuthResponse,
  ApprovalStatusResponse,
  UserRole,
  TokenType,
  RegistrationStatus,
} from '@/types/auth';