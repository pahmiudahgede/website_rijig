// components/ui/loading-spinner.tsx
import { cn } from '@/lib/utils';
import type { SpinnerSize, SpinnerVariant } from '@/types/ui';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const variantClasses: Record<SpinnerVariant, string> = {
  primary: 'text-primary',
  secondary: 'text-muted-foreground',
  white: 'text-white',
};

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary', 
  className 
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoadingDotsProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

export function LoadingDots({ 
  size = 'md', 
  variant = 'primary', 
  className 
}: LoadingDotsProps) {
  const dotSize = size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3';
  
  return (
    <div className={cn('flex space-x-1', className)} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-pulse',
            dotSize,
            variantClasses[variant]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoadingStateProps {
  isLoading: boolean;
  loadingText?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
}

export function LoadingState({
  isLoading,
  loadingText,
  size = 'md',
  variant = 'primary',
  className,
  children,
  overlay = false,
}: LoadingStateProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  const loadingContent = (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <LoadingSpinner size={size} variant={variant} />
      {loadingText && (
        <p className={cn('text-sm', variantClasses[variant])}>
          {loadingText}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          {loadingContent}
        </div>
      </div>
    );
  }

  return loadingContent;
}