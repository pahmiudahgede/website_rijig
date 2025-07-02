export interface ApiResponse<T = any> {
  meta: {
    status: number;
    message: string;
  };
  data?: T;
}

export type UserRole = "administrator" | "pengelola";
export type TokenType = "partial" | "full";
export type RegistrationStatus =
  | "uncomplete"
  | "awaiting_approval"
  | "approved"
  | "complete";

export interface AdminRegisterRequest {
  name: string;
  gender: "laki-laki" | "perempuan";
  dateofbirth: string;
  placeofbirth: string;
  phone: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AdminLoginRequest {
  device_id: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  registration_status: RegistrationStatus;
  session_id: string;
  token_type?: TokenType;
  expires_in?: number;
  next_step?: string;
}

export interface PengelolaOtpRequest {
  role_name: "pengelola";
  phone: string;
}

export interface PengelolaOtpVerifyRequest {
  role_name: "pengelola";
  phone: string;
  otp: string;
  device_id: string;
}

export interface CompanyProfileRequest {
  companyname: string;
  companyaddress: string;
  companyphone: string;
  companyemail: string;
  companywebsite: string;
  company_logo: File;
  taxid: string;
  foundeddate: string;
  companytype: string;
  companydescription: string;
}

export interface PinRequest {
  userpin: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ApprovalStatusResponse {
  message: string;
  registration_status: RegistrationStatus;
  next_step: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: TokenType;
  expires_in?: number;
  session_id?: string;
}
