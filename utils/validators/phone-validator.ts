// utils/validators/phone-validator.ts
import type { PhoneValidationResult } from '@/types/validation';
import { ValidationMessages } from '@/types/validation';

/**
 * Validate Indonesian phone number
 * Requirements: Must be 62... format with 8-14 digits after 62
 */
export function validatePhone(phone: string): PhoneValidationResult {
  // Remove all spaces and special characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if starts with 62
  if (!cleaned.startsWith('62')) {
    return {
      isValid: false,
      error: ValidationMessages.PHONE_INVALID,
    };
  }

  // Extract digits after 62
  const digitsAfter62 = cleaned.substring(2);
  
  // Check if all remaining characters are digits
  if (!/^\d+$/.test(digitsAfter62)) {
    return {
      isValid: false,
      error: ValidationMessages.PHONE_INVALID,
    };
  }

  // Check length (8-14 digits after 62)
  if (digitsAfter62.length < 8 || digitsAfter62.length > 14) {
    return {
      isValid: false,
      error: ValidationMessages.PHONE_LENGTH,
    };
  }

  return {
    isValid: true,
    formatted: cleaned,
    countryCode: '62',
  };
}

/**
 * Validate company phone number
 * Requirements: Must be 62... format with 9-14 digits after 62
 */
export function validateCompanyPhone(phone: string): PhoneValidationResult {
  // Remove all spaces and special characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if starts with 62
  if (!cleaned.startsWith('62')) {
    return {
      isValid: false,
      error: ValidationMessages.COMPANY_PHONE_INVALID,
    };
  }

  // Extract digits after 62
  const digitsAfter62 = cleaned.substring(2);
  
  // Check if all remaining characters are digits
  if (!/^\d+$/.test(digitsAfter62)) {
    return {
      isValid: false,
      error: ValidationMessages.COMPANY_PHONE_INVALID,
    };
  }

  // Check length (9-14 digits after 62 for company)
  if (digitsAfter62.length < 9 || digitsAfter62.length > 14) {
    return {
      isValid: false,
      error: ValidationMessages.COMPANY_PHONE_INVALID,
    };
  }

  return {
    isValid: true,
    formatted: cleaned,
    countryCode: '62',
  };
}

/**
 * Format phone number for display
 */
export function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.startsWith('62')) {
    const countryCode = cleaned.substring(0, 2);
    const number = cleaned.substring(2);
    
    // Format as +62 XXX-XXXX-XXXX
    if (number.length >= 8) {
      const first = number.substring(0, 3);
      const middle = number.substring(3, 7);
      const last = number.substring(7);
      
      if (last) {
        return `+${countryCode} ${first}-${middle}-${last}`;
      } else {
        return `+${countryCode} ${first}-${middle}`;
      }
    }
  }
  
  return phone;
}

/**
 * Convert phone number to Indonesian format (0xxx)
 */
export function phoneToLocalFormat(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.startsWith('62')) {
    return '0' + cleaned.substring(2);
  }
  
  return phone;
}

/**
 * Convert local format (0xxx) to international format (62xxx)
 */
export function phoneToInternationalFormat(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.substring(1);
  }
  
  if (cleaned.startsWith('62')) {
    return cleaned;
  }
  
  // If no prefix, assume it's missing the 0
  return '62' + cleaned;
}