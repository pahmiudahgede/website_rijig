// utils/validators/index.ts

// Phone validation
export {
  validatePhone,
  validateCompanyPhone,
  formatPhoneDisplay,
  phoneToLocalFormat,
  phoneToInternationalFormat,
} from './phone-validator';

// Password validation
export {
  validatePassword,
  validatePasswordConfirmation,
  calculatePasswordStrength,
  getPasswordStrengthMessage,
  getPasswordStrengthColor,
  getPasswordSuggestions,
} from './password-validator';

// Date validation
export {
  validateDate,
  validateBirthDate,
  validateFoundedDate,
  formatDateToString,
  parseDateString,
  calculateAge,
  toHTMLDateValue,
  fromHTMLDateValue,
} from './date-validator';

// Common validators
export {
  validateEmail,
  validateRequired,
  validateOTP,
  validatePIN,
  validateWebsite,
  validateTaxID,
  validateLength,
  validateFile,
  validateImageFile,
  validateGender,
  validateCompanyType,
  normalizeString,
  isAlphabetic,
  isNumeric,
  isAlphanumeric,
} from './common-validators';

// Form validator
export {
  FormValidator,
  createAdminRegistrationValidator,
  createAdminLoginValidator,
  createPengelolaPhoneValidator,
  createOTPValidator,
  createPINValidator,
  createCompanyProfileValidator,
} from './form-validator';

// Re-export types
export type {
  ValidationResult,
  PhoneValidationResult,
  PasswordValidationResult,
  DateValidationResult,
  FormValidationResult,
  PasswordStrength,
  ValidationRules,
  FieldValidator,
} from '@/types/validation';

export { ValidationMessages } from '@/types/validation';