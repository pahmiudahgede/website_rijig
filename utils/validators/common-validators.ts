// utils/validators/common-validators.ts
import type { ValidationResult } from '@/types/validation';
import { ValidationMessages } from '@/types/validation';

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: ValidationMessages.EMAIL_INVALID,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate required field
 */
export function validateRequired(value: string): ValidationResult {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      error: ValidationMessages.REQUIRED,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate OTP (4 digit)
 */
export function validateOTP(otp: string): ValidationResult {
  if (!/^\d{4}$/.test(otp)) {
    return {
      isValid: false,
      error: ValidationMessages.OTP_INVALID,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate PIN (6 digit)
 */
export function validatePIN(pin: string): ValidationResult {
  if (!/^\d{6}$/.test(pin)) {
    return {
      isValid: false,
      error: ValidationMessages.PIN_INVALID,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate website URL
 */
export function validateWebsite(website: string): ValidationResult {
  if (!website) {
    return { isValid: true }; // Website is optional
  }
  
  try {
    const url = new URL(website);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return {
        isValid: false,
        error: ValidationMessages.WEBSITE_INVALID,
      };
    }
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: ValidationMessages.WEBSITE_INVALID,
    };
  }
}

/**
 * Validate Tax ID (simple validation for Indonesian tax ID)
 */
export function validateTaxID(taxId: string): ValidationResult {
  // Remove any spaces or separators
  const cleaned = taxId.replace(/[\s\.\-]/g, '');
  
  // Indonesian Tax ID (NPWP) should be 15 digits
  if (!/^\d{15}$/.test(cleaned)) {
    return {
      isValid: false,
      error: ValidationMessages.TAX_ID_INVALID,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  min?: number,
  max?: number
): ValidationResult {
  const length = value.length;
  
  if (min !== undefined && length < min) {
    return {
      isValid: false,
      error: ValidationMessages.MIN_LENGTH(min),
    };
  }
  
  if (max !== undefined && length > max) {
    return {
      isValid: false,
      error: ValidationMessages.MAX_LENGTH(max),
    };
  }
  
  return { isValid: true };
}

/**
 * Validate file type and size
 */
export function validateFile(
  file: File | null,
  allowedTypes: string[] = [],
  maxSizeMB: number = 5
): ValidationResult {
  if (!file) {
    return {
      isValid: false,
      error: 'File wajib dipilih',
    };
  }
  
  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipe file harus: ${allowedTypes.join(', ')}`,
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Ukuran file maksimal ${maxSizeMB}MB`,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate image file
 */
export function validateImageFile(file: File | null): ValidationResult {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validateFile(file, allowedTypes, 2); // 2MB limit for images
}

/**
 * Validate gender
 */
export function validateGender(gender: string): ValidationResult {
  const validGenders = ['laki-laki', 'perempuan'];
  
  if (!validGenders.includes(gender)) {
    return {
      isValid: false,
      error: 'Pilih jenis kelamin yang valid',
    };
  }
  
  return { isValid: true };
}

/**
 * Validate company type
 */
export function validateCompanyType(type: string): ValidationResult {
  // Add common company types validation if needed
  if (!type || type.trim().length === 0) {
    return {
      isValid: false,
      error: 'Jenis perusahaan wajib diisi',
    };
  }
  
  return { isValid: true };
}

/**
 * Clean and normalize string input
 */
export function normalizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/**
 * Check if string contains only alphabetic characters (with spaces)
 */
export function isAlphabetic(value: string): boolean {
  return /^[a-zA-Z\s]+$/.test(value);
}

/**
 * Check if string contains only numeric characters
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Check if string is alphanumeric
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}