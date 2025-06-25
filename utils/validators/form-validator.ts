// utils/validators/form-validator.ts
import type { FormValidationResult, ValidationRules } from '@/types/validation';
import { validateRequired, validateLength } from './common-validators';

export class FormValidator {
  private rules: Record<string, ValidationRules[]> = {};
  private errors: Record<string, string> = {};

  /**
   * Add validation rules for a field
   */
  addRules(fieldName: string, rules: ValidationRules[]): FormValidator {
    this.rules[fieldName] = rules;
    return this;
  }

  /**
   * Add a single rule for a field
   */
  addRule(fieldName: string, rule: ValidationRules): FormValidator {
    if (!this.rules[fieldName]) {
      this.rules[fieldName] = [];
    }
    this.rules[fieldName].push(rule);
    return this;
  }

  /**
   * Validate all fields with their rules
   */
  validate(data: Record<string, any>): FormValidationResult {
    this.errors = {};

    Object.entries(this.rules).forEach(([fieldName, fieldRules]) => {
      const value = data[fieldName] || '';
      
      for (const rule of fieldRules) {
        const result = this.validateField(value, rule);
        
        if (!result.isValid) {
          this.errors[fieldName] = result.error!;
          break; // Stop at first error for this field
        }
      }
    });

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: this.errors,
    };
  }

  /**
   * Validate a single field
   */
  validateSingle(fieldName: string, value: any): string | null {
    const fieldRules = this.rules[fieldName];
    
    if (!fieldRules) {
      return null;
    }

    for (const rule of fieldRules) {
      const result = this.validateField(value, rule);
      
      if (!result.isValid) {
        return result.error!;
      }
    }

    return null;
  }

  /**
   * Clear errors for a specific field
   */
  clearError(fieldName: string): void {
    delete this.errors[fieldName];
  }

  /**
   * Clear all errors
   */
  clearAllErrors(): void {
    this.errors = {};
  }

  /**
   * Get current errors
   */
  getErrors(): Record<string, string> {
    return { ...this.errors };
  }

  /**
   * Check if form has any errors
   */
  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  /**
   * Validate individual field with rule
   */
  private validateField(value: any, rule: ValidationRules) {
    const stringValue = String(value || '');

    // Required validation
    if (rule.required) {
      const requiredResult = validateRequired(stringValue);
      if (!requiredResult.isValid) {
        return {
          isValid: false,
          error: rule.message || requiredResult.error,
        };
      }
    }

    // Skip other validations if field is empty and not required
    if (!rule.required && !stringValue) {
      return { isValid: true };
    }

    // Length validation
    if (rule.minLength !== undefined || rule.maxLength !== undefined) {
      const lengthResult = validateLength(stringValue, rule.minLength, rule.maxLength);
      if (!lengthResult.isValid) {
        return {
          isValid: false,
          error: rule.message || lengthResult.error,
        };
      }
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      return {
        isValid: false,
        error: rule.message || 'Format tidak valid',
      };
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(stringValue);
      if (!customResult.isValid) {
        return {
          isValid: false,
          error: rule.message || customResult.error,
        };
      }
    }

    return { isValid: true };
  }
}

/**
 * Create form validator with predefined rules for admin registration
 */
export function createAdminRegistrationValidator(): FormValidator {
  return new FormValidator()
    .addRule('name', { required: true, minLength: 2, maxLength: 100 })
    .addRule('gender', { required: true })
    .addRule('dateofbirth', { required: true })
    .addRule('placeofbirth', { required: true, minLength: 2, maxLength: 100 })
    .addRule('phone', { required: true })
    .addRule('email', { required: true })
    .addRule('password', { required: true })
    .addRule('password_confirm', { required: true });
}

/**
 * Create form validator for admin login
 */
export function createAdminLoginValidator(): FormValidator {
  return new FormValidator()
    .addRule('email', { required: true })
    .addRule('password', { required: true });
}

/**
 * Create form validator for pengelola phone registration
 */
export function createPengelolaPhoneValidator(): FormValidator {
  return new FormValidator()
    .addRule('phone', { required: true });
}

/**
 * Create form validator for OTP verification
 */
export function createOTPValidator(): FormValidator {
  return new FormValidator()
    .addRule('otp', { 
      required: true, 
      pattern: /^\d{4}$/,
      message: 'Kode OTP harus 4 digit'
    });
}

/**
 * Create form validator for PIN
 */
export function createPINValidator(): FormValidator {
  return new FormValidator()
    .addRule('userpin', { 
      required: true, 
      pattern: /^\d{6}$/,
      message: 'PIN harus 6 digit angka'
    });
}

/**
 * Create form validator for company profile
 */
export function createCompanyProfileValidator(): FormValidator {
  return new FormValidator()
    .addRule('companyname', { required: true, minLength: 2, maxLength: 200 })
    .addRule('companyaddress', { required: true, minLength: 10, maxLength: 500 })
    .addRule('companyphone', { required: true })
    .addRule('companyemail', { required: true })
    .addRule('companywebsite', { required: false })
    .addRule('taxid', { required: true })
    .addRule('foundeddate', { required: true })
    .addRule('companytype', { required: true, minLength: 2, maxLength: 100 })
    .addRule('companydescription', { required: true, minLength: 10, maxLength: 1000 });
}