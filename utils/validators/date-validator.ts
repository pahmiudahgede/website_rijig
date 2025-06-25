// utils/validators/date-validator.ts
import type { DateValidationResult } from '@/types/validation';
import { ValidationMessages } from '@/types/validation';

/**
 * Validate date in DD-MM-YYYY format
 */
export function validateDate(dateString: string): DateValidationResult {
  // Check format with regex
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = dateString.match(dateRegex);
  
  if (!match) {
    return {
      isValid: false,
      error: ValidationMessages.DATE_INVALID,
    };
  }
  
  const [, day, month, year] = match;
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  // Create date object (month is 0-indexed in JS)
  const date = new Date(yearNum, monthNum - 1, dayNum);
  
  // Check if the date is valid (handles things like 31st February)
  if (
    date.getFullYear() !== yearNum ||
    date.getMonth() !== monthNum - 1 ||
    date.getDate() !== dayNum
  ) {
    return {
      isValid: false,
      error: ValidationMessages.DATE_INVALID,
    };
  }
  
  return {
    isValid: true,
    parsed: date,
    formatted: dateString,
  };
}

/**
 * Validate birth date (cannot be in future, reasonable age limits)
 */
export function validateBirthDate(dateString: string): DateValidationResult {
  const basicValidation = validateDate(dateString);
  
  if (!basicValidation.isValid) {
    return basicValidation;
  }
  
  const date = basicValidation.parsed!;
  const now = new Date();
  
  // Check if date is in the future
  if (date > now) {
    return {
      isValid: false,
      error: ValidationMessages.DATE_FUTURE,
    };
  }
  
  // Check if date is too old (more than 100 years ago)
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(now.getFullYear() - 100);
  
  if (date < hundredYearsAgo) {
    return {
      isValid: false,
      error: ValidationMessages.DATE_TOO_OLD,
    };
  }
  
  return basicValidation;
}

/**
 * Validate company founded date
 */
export function validateFoundedDate(dateString: string): DateValidationResult {
  const basicValidation = validateDate(dateString);
  
  if (!basicValidation.isValid) {
    return basicValidation;
  }
  
  const date = basicValidation.parsed!;
  const now = new Date();
  
  // Check if date is in the future
  if (date > now) {
    return {
      isValid: false,
      error: ValidationMessages.DATE_FUTURE,
    };
  }
  
  // Check if date is too old (more than 200 years ago)
  const twoHundredYearsAgo = new Date();
  twoHundredYearsAgo.setFullYear(now.getFullYear() - 200);
  
  if (date < twoHundredYearsAgo) {
    return {
      isValid: false,
      error: 'Tanggal pendirian terlalu lama',
    };
  }
  
  return basicValidation;
}

/**
 * Format date from Date object to DD-MM-YYYY string
 */
export function formatDateToString(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  
  return `${day}-${month}-${year}`;
}

/**
 * Parse DD-MM-YYYY string to Date object
 */
export function parseDateString(dateString: string): Date | null {
  const validation = validateDate(dateString);
  return validation.isValid ? validation.parsed! : null;
}

/**
 * Get age from birth date string
 */
export function calculateAge(birthDateString: string): number | null {
  const validation = validateBirthDate(birthDateString);
  
  if (!validation.isValid) {
    return null;
  }
  
  const birthDate = validation.parsed!;
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Get date input value for HTML date input (YYYY-MM-DD format)
 */
export function toHTMLDateValue(dateString: string): string {
  const validation = validateDate(dateString);
  
  if (!validation.isValid) {
    return '';
  }
  
  const date = validation.parsed!;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Convert HTML date input value (YYYY-MM-DD) to DD-MM-YYYY format
 */
export function fromHTMLDateValue(htmlDate: string): string {
  const [year, month, day] = htmlDate.split('-');
  return `${day}-${month}-${year}`;
}