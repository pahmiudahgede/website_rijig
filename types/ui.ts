export type ToastType = "success" | "error" | "warning" | "info";

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

export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerVariant = "primary" | "secondary" | "white";

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormErrorDisplayProps {
  errors: Record<string, string> | FormFieldError[];
  showIcon?: boolean;
  className?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export interface LoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  children?: React.ReactNode;
}
