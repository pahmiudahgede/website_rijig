// utils/validators/password-validator.ts
import type { PasswordValidationResult, PasswordStrength } from '@/types/validation';
import { ValidationMessages } from '@/types/validation';

/**
 * Validate password according to API requirements
 * Requirements: 
 * - Minimal 8 karakter
 * - Ada minimal 1 huruf kapital
 * - Ada karakter khusus
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  // Check minimum length
  if (password.length < 8) {
    errors.push(ValidationMessages.PASSWORD_MIN_LENGTH);
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push(ValidationMessages.PASSWORD_UPPERCASE);
  }
  
  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
    errors.push(ValidationMessages.PASSWORD_SPECIAL);
  }
  
  const isValid = errors.length === 0;
  const strength = calculatePasswordStrength(password);
  
  return {
    isValid,
    error: isValid ? undefined : errors.join(', '),
    strength,
    suggestions: isValid ? [] : errors,
  };
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(password: string, confirmation: string): boolean {
  return password === confirmation;
}

/**
 * Calculate password strength
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  
  // Length bonus
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 1; // lowercase
  if (/[A-Z]/.test(password)) score += 1; // uppercase
  if (/[0-9]/.test(password)) score += 1; // numbers
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) score += 1; // special chars
  
  // Sequential characters penalty
  if (/(.)\1{2,}/.test(password)) score -= 1; // repeated chars
  if (/123|234|345|456|567|678|789|890|abc|bcd|cde|def/.test(password.toLowerCase())) score -= 1; // sequential
  
  if (score >= 5) return 'strong';
  if (score >= 3) return 'medium';
  return 'weak';
}

/**
 * Get password strength message
 */
export function getPasswordStrengthMessage(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'Password lemah';
    case 'medium':
      return 'Password sedang';
    case 'strong':
      return 'Password kuat';
    default:
      return '';
  }
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'strong':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * Get password improvement suggestions
 */
export function getPasswordSuggestions(password: string): string[] {
  const suggestions: string[] = [];
  
  if (password.length < 8) {
    suggestions.push('Tambahkan lebih banyak karakter (minimal 8)');
  }
  
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Tambahkan huruf kapital');
  }
  
  if (!/[a-z]/.test(password)) {
    suggestions.push('Tambahkan huruf kecil');
  }
  
  if (!/[0-9]/.test(password)) {
    suggestions.push('Tambahkan angka');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
    suggestions.push('Tambahkan karakter khusus (!@#$%^&* dll)');
  }
  
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Hindari karakter berulang');
  }
  
  if (password.length < 12) {
    suggestions.push('Gunakan password yang lebih panjang untuk keamanan maksimal');
  }
  
  return suggestions;
}