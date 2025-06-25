// components/ui/api-error-handler.tsx
'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ApiError } from '@/types/ui';

interface ApiErrorHandlerProps {
  error: ApiError | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetry?: boolean;
  className?: string;
  variant?: 'default' | 'destructive';
}

export function ApiErrorHandler({
  error,
  onRetry,
  onDismiss,
  showRetry = true,
  className,
  variant = 'destructive',
}: ApiErrorHandlerProps) {
  if (!error) return null;

  // Convert string error to ApiError object
  const apiError: ApiError = typeof error === 'string' 
    ? { message: error }
    : error;

  // Determine error type and appropriate messaging
  const getErrorInfo = (error: ApiError) => {
    const status = error.status;
    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return {
        icon: WifiOff,
        title: 'Connection Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
        showRetry: true,
      };
    }

    // Timeout errors
    if (message.includes('timeout')) {
      return {
        icon: RefreshCw,
        title: 'Request Timeout',
        description: 'The request took too long to complete. Please try again.',
        showRetry: true,
      };
    }

    // Status-based errors
    switch (status) {
      case 400:
        return {
          icon: AlertCircle,
          title: 'Invalid Request',
          description: error.message || 'Please check your input and try again.',
          showRetry: false,
        };

      case 401:
        return {
          icon: AlertCircle,
          title: 'Authentication Required',
          description: 'Please log in to continue.',
          showRetry: false,
        };

      case 403:
        return {
          icon: AlertCircle,
          title: 'Access Denied',
          description: 'You do not have permission to perform this action.',
          showRetry: false,
        };

      case 404:
        return {
          icon: AlertCircle,
          title: 'Not Found',
          description: 'The requested resource could not be found.',
          showRetry: false,
        };

      case 429:
        return {
          icon: RefreshCw,
          title: 'Too Many Requests',
          description: 'Please wait a moment before trying again.',
          showRetry: true,
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          icon: RefreshCw,
          title: 'Server Error',
          description: 'Something went wrong on our end. Please try again.',
          showRetry: true,
        };

      default:
        return {
          icon: AlertCircle,
          title: 'Error',
          description: error.message || 'An unexpected error occurred.',
          showRetry: true,
        };
    }
  };

  const errorInfo = getErrorInfo(apiError);
  const Icon = errorInfo.icon;

  return (
    <Alert variant={variant} className={cn('', className)}>
      <Icon className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        {errorInfo.title}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1"
            onClick={onDismiss}
          >
            ×
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{errorInfo.description}</p>
        
        {/* Show additional error details in development */}
        {process.env.NODE_ENV === 'development' && apiError.details && (
          <details className="text-xs opacity-70">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-1 whitespace-pre-wrap">
              {JSON.stringify(apiError.details, null, 2)}
            </pre>
          </details>
        )}
        
        {/* Action buttons */}
        {(showRetry && errorInfo.showRetry && onRetry) && (
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: ApiError) => React.ReactNode;
  onError?: (error: ApiError) => void;
}

interface ApiErrorBoundaryState {
  hasError: boolean;
  error?: ApiError;
}

export class ApiErrorBoundary extends React.Component<
  ApiErrorBoundaryProps,
  ApiErrorBoundaryState
> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ApiErrorBoundaryState {
    return {
      hasError: true,
      error: {
        message: error.message,
        details: error,
      },
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('API Error Boundary caught an error:', error, errorInfo);
    
    const apiError: ApiError = {
      message: error.message,
      details: { error, errorInfo },
    };
    
    this.props.onError?.(apiError);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error);
      }

      return (
        <ApiErrorHandler
          error={this.state.error}
          onRetry={() => {
            this.setState({ hasError: false, error: undefined });
          }}
          showRetry={true}
        />
      );
    }

    return this.props.children;
  }
}

// Hook for easy API error handling
export function useApiErrorHandler() {
  const [error, setError] = React.useState<ApiError | null>(null);

  const handleError = React.useCallback((err: any) => {
    let apiError: ApiError;

    if (typeof err === 'string') {
      apiError = { message: err };
    } else if (err?.response) {
      // Axios error
      apiError = {
        message: err.response.data?.meta?.message || err.message || 'An error occurred',
        status: err.response.status,
        details: err.response.data,
      };
    } else if (err?.message) {
      // Regular Error object
      apiError = {
        message: err.message,
        details: err,
      };
    } else {
      // Unknown error
      apiError = {
        message: 'An unexpected error occurred',
        details: err,
      };
    }

    setError(apiError);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  const retry = React.useCallback((retryFn: () => void | Promise<void>) => {
    clearError();
    try {
      const result = retryFn();
      if (result instanceof Promise) {
        result.catch(handleError);
      }
    } catch (err) {
      handleError(err);
    }
  }, [clearError, handleError]);

  return {
    error,
    handleError,
    clearError,
    retry,
  };
}