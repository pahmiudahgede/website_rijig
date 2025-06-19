export type Role = "administrator" | "pengelola";
export type Gender = "laki-laki" | "perempuan";
export type RegistrationStatus =
  | "uncomplete"
  | "awaiting_approval"
  | "approved"
  | "complete";
export type TokenType = "partial" | "full";
export type NextStep =
  | "complete_company_data"
  | "awaiting_admin_approval"
  | "wait_for_approval"
  | "create_pin"
  | "verif_pin"
  | "completed";

export type PhoneNumber = string;
export type ValidatedPhone = `62${string}`;

export interface AdminRegisterRequest {
  name: string;
  gender: Gender;
  dateofbirth: string;
  placeofbirth: string;
  phone: PhoneNumber;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AdminLoginRequest {
  device_id: string;
  email: string;
  password: string;
}

export interface RequestOTPRequest {
  role_name: Role;
  phone: PhoneNumber;
}

export interface VerifyOTPRequest {
  role_name: Role;
  phone: PhoneNumber;
  otp: string;
  device_id: string;
}

export interface CreateCompanyRequest {
  companyname: string;
  companyaddress: string;
  companyphone: PhoneNumber;
  companyemail: string;
  companywebsite: string;
  company_logo: File;
  taxid: string;
  foundeddate: string;
  companytype: string;
  companydescription: string;
}

export interface CreatePinRequest {
  userpin: string;
}

export interface VerifyPinRequest {
  userpin: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ApiResponse<T = any> {
  meta: {
    status: number;
    message: string;
  };
  data?: T;
}

export interface ApiErrorResponse {
  meta: {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
  };
}

export interface AuthTokenData {
  message: string;
  access_token: string;
  refresh_token: string;
  token_type?: TokenType;
  expires_in?: number;
  registration_status: RegistrationStatus;
  next_step?: NextStep;
  session_id: string;
  registration_progress?: number;
}

export interface ApprovalStatusData {
  message: string;
  registration_status: RegistrationStatus;
  next_step?: NextStep;
  access_token?: string;
  refresh_token?: string;
  token_type?: TokenType;
  expires_in?: number;
  session_id?: string;
}

export interface User {
  role: Role;
  registration_status: RegistrationStatus;
  session_id: string;
  device_id: string;
  phone?: PhoneNumber;
  email?: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;

  login(role: "administrator", credentials: AdminLoginRequest): Promise<void>;
  login(role: "pengelola", credentials: VerifyOTPRequest): Promise<void>;

  register(role: "administrator", data: AdminRegisterRequest): Promise<void>;
  register(role: "pengelola", data: RequestOTPRequest): Promise<void>;

  verifyOTP: (data: VerifyOTPRequest) => Promise<AuthTokenData>;
  createCompanyProfile: (data: CreateCompanyRequest) => Promise<AuthTokenData>;
  checkApprovalStatus: () => Promise<ApprovalStatusData>;
  createPin: (pin: string) => Promise<AuthTokenData>;
  verifyPin: (pin: string) => Promise<AuthTokenData>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "rijig_access_token",
  REFRESH_TOKEN: "rijig_refresh_token",
  USER: "rijig_user",
  DEVICE_ID: "rijig_device_id",
  ROLE: "rijig_role",
  REGISTRATION_STATUS: "rijig_registration_status",
  SESSION_ID: "rijig_session_id"
} as const;

export const AUTH_ENDPOINTS = {
  ADMIN_REGISTER: "/auth/register/admin",
  ADMIN_LOGIN: "/auth/login/admin",

  REQUEST_OTP_REGISTER: "/auth/request-otp/register",
  VERIFY_OTP_REGISTER: "/auth/verif-otp/register",

  REQUEST_OTP: "/auth/request-otp",
  VERIFY_OTP: "/auth/verif-otp",

  CREATE_COMPANY: "/companyprofile/create",
  CHECK_APPROVAL: "/auth/cekapproval",
  CREATE_PIN: "/pin/create",
  VERIFY_PIN: "/pin/verif",

  REFRESH_TOKEN: "/auth/refresh-token",
  LOGOUT: "/auth/logout"
} as const;

export const VALIDATION_PATTERNS = {
  PHONE: /^62\d{8,14}$/,
  COMPANY_PHONE: /^62\d{9,14}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PIN: /^\d{6}$/,
  OTP: /^\d{4}$/,
  DATE: /^\d{2}-\d{2}-\d{4}$/,
  TAX_ID: /^\d+$/
} as const;

export const VALIDATION_MESSAGES = {
  PHONE: "Nomor telepon harus diawali 62 dan memiliki 8-14 digit",
  COMPANY_PHONE:
    "Nomor telepon perusahaan harus diawali 62 dan memiliki 9-14 digit",
  EMAIL: "Format email tidak valid",
  PASSWORD:
    "Password minimal 8 karakter dengan 1 huruf kapital dan 1 karakter khusus",
  PIN: "PIN harus 6 digit angka",
  OTP: "OTP harus 4 digit angka",
  DATE: "Format tanggal harus DD-MM-YYYY",
  REQUIRED: "Field ini wajib diisi"
} as const;

export const validateField = (value: string, pattern: RegExp): boolean => {
  return pattern.test(value);
};

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const parseDate = (dateString: string): Date | null => {
  if (!VALIDATION_PATTERNS.DATE.test(dateString)) {
    return null;
  }

  const [day, month, year] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};
