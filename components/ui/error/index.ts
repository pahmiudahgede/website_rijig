// components/ui/error/index.ts

// Loading components
export {
  LoadingSpinner,
  LoadingDots,
  LoadingState,
} from '../loading-spinner';

// Form error components
export {
  FieldError,
  FormErrorSummary,
  InlineFormError,
  FormErrorBoundary,
  FormErrorDisplay,
} from '../form-error-display';

// Toast notification system
export {
  ToastProvider,
  useToast,
  useToastHelpers,
  toast,
} from '../toast-notification';

// API error handling
export {
  ApiErrorHandler,
  ApiErrorBoundary,
  useApiErrorHandler,
} from '../api-error-handler';

// Re-export types
export type {
  ToastType,
  ToastMessage,
  SpinnerSize,
  SpinnerVariant,
  FormFieldError,
  FormErrorDisplayProps,
  ApiError,
  LoadingStateProps,
} from '@/types/ui';