export type UserRole = "administrator" | "pengelola";

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

export interface AdminRegisterData {
  name: string;
  gender: "laki-laki" | "perempuan";
  dateofbirth: string;
  placeofbirth: string;
  phone: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AdminLoginData {
  device_id: string;
  email: string;
  password: string;
}

export interface PengelolaOTPRequest {
  role_name: "pengelola";
  phone: string;
}

export interface PengelolaOTPVerification {
  role_name: "pengelola";
  phone: string;
  otp: string;
  device_id: string;
}

export interface CompanyProfileData {
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

export interface PINData {
  userpin: string;
}

export interface AuthResponseData {
  message: string;
  access_token: string;
  refresh_token: string;
  token_type?: TokenType;
  expires_in?: number;
  registration_status: RegistrationStatus | "completed";
  next_step?: NextStep;
  session_id: string;
}

export interface User {
  role: UserRole;
  access_token: string;
  refresh_token: string;
  session_id: string;
  registration_status: RegistrationStatus | "completed";
  token_type?: TokenType;
  device_id: string;
}
