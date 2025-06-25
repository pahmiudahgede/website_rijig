// types/validation.ts

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Field validation function type
export type FieldValidator = (value: string) => ValidationResult;

// Validation rules configuration
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: FieldValidator;
  message?: string;
}

// Form validation result
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Phone validation result with formatting
export interface PhoneValidationResult extends ValidationResult {
  formatted?: string;
  countryCode?: string;
}

// Password strength levels
export type PasswordStrength = 'weak' | 'medium' | 'strong';

// Password validation result with strength
export interface PasswordValidationResult extends ValidationResult {
  strength?: PasswordStrength;
  suggestions?: string[];
}

// Date validation result with parsing
export interface DateValidationResult extends ValidationResult {
  parsed?: Date;
  formatted?: string;
}

// Common validation error messages
export const ValidationMessages = {
  REQUIRED: 'Field ini wajib diisi',
  EMAIL_INVALID: 'Format email tidak valid',
  PHONE_INVALID: 'Nomor telepon harus dalam format 62... (8-14 digit)',
  PHONE_LENGTH: 'Nomor telepon harus 8-14 digit setelah 62',
  PHONE_USED: 'Nomor telepon sudah digunakan',
  PASSWORD_MIN_LENGTH: 'Password minimal 8 karakter',
  PASSWORD_UPPERCASE: 'Password harus mengandung minimal 1 huruf kapital',
  PASSWORD_SPECIAL: 'Password harus mengandung minimal 1 karakter khusus',
  PASSWORD_MISMATCH: 'Konfirmasi password tidak sama',
  OTP_INVALID: 'Kode OTP harus 4 digit',
  PIN_INVALID: 'PIN harus 6 digit angka',
  DATE_INVALID: 'Format tanggal tidak valid (DD-MM-YYYY)',
  DATE_FUTURE: 'Tanggal tidak boleh di masa depan',
  DATE_TOO_OLD: 'Tanggal terlalu lama',
  WEBSITE_INVALID: 'Format website tidak valid',
  TAX_ID_INVALID: 'Tax ID tidak valid',
  COMPANY_PHONE_INVALID: 'Nomor telepon perusahaan harus dalam format 62... (9-14 digit)',
  MIN_LENGTH: (min: number) => `Minimal ${min} karakter`,
  MAX_LENGTH: (max: number) => `Maksimal ${max} karakter`,
} as const;