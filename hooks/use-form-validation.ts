// hooks/use-form-validation.ts
import { useState, useCallback, useRef } from 'react';
import { FormValidator } from '@/utils/validators/form-validator';
import type { FormValidationResult } from '@/types/validation';

interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

/**
 * Hook for form validation with real-time feedback
 */
export function useFormValidation(
  validator: FormValidator,
  options: UseFormValidationOptions = {}
) {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    debounceMs = 300,
  } = options;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);
  const debounceTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // Validate entire form
  const validateForm = useCallback((data: Record<string, any>): FormValidationResult => {
    setIsValidating(true);
    const result = validator.validate(data);
    setErrors(result.errors);
    setIsValidating(false);
    return result;
  }, [validator]);

  // Validate single field
  const validateField = useCallback((fieldName: string, value: any) => {
    const error = validator.validateSingle(fieldName, value);
    
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[fieldName] = error;
      } else {
        delete newErrors[fieldName];
      }
      return newErrors;
    });

    return error;
  }, [validator]);

  // Debounced field validation
  const validateFieldDebounced = useCallback((fieldName: string, value: any) => {
    // Clear existing timeout
    if (debounceTimeouts.current[fieldName]) {
      clearTimeout(debounceTimeouts.current[fieldName]);
    }

    // Set new timeout
    debounceTimeouts.current[fieldName] = setTimeout(() => {
      validateField(fieldName, value);
    }, debounceMs);
  }, [validateField, debounceMs]);

  // Handle field change
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    if (validateOnChange) {
      if (debounceMs > 0) {
        validateFieldDebounced(fieldName, value);
      } else {
        validateField(fieldName, value);
      }
    }
  }, [validateOnChange, validateField, validateFieldDebounced, debounceMs]);

  // Handle field blur
  const handleFieldBlur = useCallback((fieldName: string, value: any) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    if (validateOnBlur) {
      validateField(fieldName, value);
    }
  }, [validateOnBlur, validateField]);

  // Clear field error
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  // Get field error (only show if touched or form was submitted)
  const getFieldError = useCallback((fieldName: string, showUntouched = false) => {
    if (!showUntouched && !touched[fieldName]) {
      return undefined;
    }
    return errors[fieldName];
  }, [errors, touched]);

  // Check if field has error
  const hasFieldError = useCallback((fieldName: string, showUntouched = false) => {
    return !!getFieldError(fieldName, showUntouched);
  }, [getFieldError]);

  // Check if form has any errors
  const hasErrors = Object.keys(errors).length > 0;

  // Check if field is touched
  const isFieldTouched = useCallback((fieldName: string) => {
    return touched[fieldName] || false;
  }, [touched]);

  return {
    // State
    errors,
    touched,
    isValidating,
    hasErrors,

    // Actions
    validateForm,
    validateField,
    handleFieldChange,
    handleFieldBlur,
    clearFieldError,
    clearAllErrors,

    // Getters
    getFieldError,
    hasFieldError,
    isFieldTouched,

    // Form field helpers
    getFieldProps: (fieldName: string) => ({
      onChange: (value: any) => handleFieldChange(fieldName, value),
      onBlur: (value: any) => handleFieldBlur(fieldName, value),
      error: getFieldError(fieldName),
      hasError: hasFieldError(fieldName),
    }),
  };
}

/**
 * Hook for simple field validation without form context
 */
export function useFieldValidation(validator: (value: any) => string | null) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validate = useCallback((value: any) => {
    const result = validator(value);
    setError(result);
    return result === null;
  }, [validator]);

  const handleChange = useCallback((value: any) => {
    if (touched) {
      validate(value);
    }
  }, [touched, validate]);

  const handleBlur = useCallback((value: any) => {
    setTouched(true);
    validate(value);
  }, [validate]);

  const clearError = useCallback(() => {
    setError(null);
    setTouched(false);
  }, []);

  return {
    error,
    touched,
    hasError: error !== null,
    validate,
    handleChange,
    handleBlur,
    clearError,
  };
}

/**
 * Hook for async field validation (like checking if email exists)
 */
export function useAsyncFieldValidation(
  asyncValidator: (value: any) => Promise<string | null>,
  debounceMs = 500
) {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [touched, setTouched] = useState(false);
//   const debounceTimeouts = useRef<Record<string, NodeJS.Timeout>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validate = useCallback(async (value: any) => {
    setIsValidating(true);
    try {
      const result = await asyncValidator(value);
      setError(result);
      return result === null;
    } catch (err) {
      setError('Validation error occurred');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [asyncValidator]);

  const validateDebounced = useCallback((value: any) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      validate(value);
    }, debounceMs);
  }, [validate, debounceMs]);

  const handleChange = useCallback((value: any) => {
    if (touched) {
      validateDebounced(value);
    }
  }, [touched, validateDebounced]);

  const handleBlur = useCallback((value: any) => {
    setTouched(true);
    validate(value);
  }, [validate]);

  const clearError = useCallback(() => {
    setError(null);
    setTouched(false);
    setIsValidating(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    error,
    touched,
    isValidating,
    hasError: error !== null,
    validate,
    handleChange,
    handleBlur,
    clearError,
  };
}