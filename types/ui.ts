// types/ui.ts

// Toast notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Loading spinner types
export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'primary' | 'secondary' | 'white';

// Form error types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormErrorDisplayProps {
  errors: Record<string, string> | FormFieldError[];
  showIcon?: boolean;
  className?: string;
}

// API error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Loading state types
export interface LoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  children?: React.ReactNode;
}