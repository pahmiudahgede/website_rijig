export const AUTH_STORAGE_KEY = 'auth-storage';
export const DEVICE_ID_KEY = 'device_id';

export const API_ENDPOINTS = {
  // Admin
  ADMIN_REGISTER: '/auth/register/admin',
  ADMIN_LOGIN: '/auth/login/admin',
  
  // Pengelola
  PENGELOLA_OTP_REGISTER: '/auth/request-otp/register',
  PENGELOLA_OTP_VERIFY_REGISTER: '/auth/verif-otp/register',
  PENGELOLA_OTP_LOGIN: '/auth/request-otp',
  PENGELOLA_OTP_VERIFY_LOGIN: '/auth/verif-otp',
  PENGELOLA_COMPANY: '/companyprofile/create',
  PENGELOLA_CHECK_APPROVAL: '/auth/cekapproval',
  PENGELOLA_CREATE_PIN: '/pin/create',
  PENGELOLA_VERIFY_PIN: '/pin/verif',
  
  // Common
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
};