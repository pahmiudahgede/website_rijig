'use client';
// components/ui/form-error-display.tsx
import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { FormErrorDisplayProps, FormFieldError } from '@/types/ui';

interface FieldErrorProps {
  message: string;
  showIcon?: boolean;
  className?: string;
}

export function FieldError({ message, showIcon = true, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <div className={cn('flex items-center space-x-1 text-sm text-destructive', className)}>
      {showIcon && <AlertCircle className="h-3 w-3 flex-shrink-0" />}
      <span>{message}</span>
    </div>
  );
}

interface FormErrorSummaryProps extends FormErrorDisplayProps {
  onDismiss?: () => void;
  dismissible?: boolean;
}

export function FormErrorSummary({
  errors,
  showIcon = true,
  className,
  onDismiss,
  dismissible = false,
}: FormErrorSummaryProps) {
  // Convert errors to array format
  const errorList: FormFieldError[] = Array.isArray(errors)
    ? errors
    : Object.entries(errors).map(([field, message]) => ({ field, message }));

  if (errorList.length === 0) return null;

  return (
    <Alert variant="destructive" className={cn('mb-4', className)}>
      <div className="flex items-start space-x-2">
        {showIcon && <AlertCircle className="h-4 w-4 mt-0.5" />}
        <div className="flex-1">
          <AlertDescription>
            {errorList.length === 1 ? (
              <span>{errorList[0].message}</span>
            ) : (
              <div>
                <p className="font-medium mb-2">Please fix the following errors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {errorList.map((error, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium capitalize">{error.field}:</span> {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </div>
        {dismissible && onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 text-destructive hover:text-destructive"
            onClick={onDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Alert>
  );
}

interface InlineFormErrorProps {
  error: string | null;
  touched?: boolean;
  showIcon?: boolean;
  className?: string;
}

export function InlineFormError({ 
  error, 
  touched = true, 
  showIcon = true, 
  className 
}: InlineFormErrorProps) {
  if (!error || !touched) return null;

  return <FieldError message={error} showIcon={showIcon} className={className} />;
}

interface FormErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

interface FormErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class FormErrorBoundary extends React.Component<
  FormErrorBoundaryProps,
  FormErrorBoundaryState
> {
  constructor(props: FormErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): FormErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Form Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Something went wrong with this form. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Main FormErrorDisplay component
export function FormErrorDisplay(props: FormErrorDisplayProps) {
  return <FormErrorSummary {...props} />;
}