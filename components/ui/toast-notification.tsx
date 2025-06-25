// components/ui/toast-notification.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { ToastMessage, ToastType } from '@/types/ui';

// Toast Context
interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Toast Provider
interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = {
      id,
      duration: 5000,
      ...toast,
    };

    setToasts(prev => {
      const updated = [...prev, newToast];
      return updated.slice(-maxToasts); // Keep only latest toasts
    });

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Toast Container
function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

// Individual Toast Item
interface ToastItemProps {
  toast: ToastMessage;
}

const toastIcons: Record<ToastType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
};

function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useToast();
  const Icon = toastIcons[toast.type];

  return (
    <div
      className={cn(
        'rounded-lg border p-4 shadow-md transition-all duration-300 ease-in-out',
        'animate-in slide-in-from-right-full',
        toastStyles[toast.type]
      )}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1 space-y-1">
          <h4 className="font-medium text-sm">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm opacity-90">{toast.description}</p>
          )}
          
          {toast.action && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-current hover:text-current hover:bg-transparent font-medium"
              onClick={toast.action.onClick}
            >
              {toast.action.label}
            </Button>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1 text-current hover:text-current hover:bg-current/10"
          onClick={() => removeToast(toast.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Toast Helpers
export const toast = {
  success: (title: string, description?: string, options?: Partial<ToastMessage>) => {
    const { addToast } = useToast();
    return addToast({ type: 'success', title, description, ...options });
  },
  
  error: (title: string, description?: string, options?: Partial<ToastMessage>) => {
    const { addToast } = useToast();
    return addToast({ type: 'error', title, description, ...options });
  },
  
  warning: (title: string, description?: string, options?: Partial<ToastMessage>) => {
    const { addToast } = useToast();
    return addToast({ type: 'warning', title, description, ...options });
  },
  
  info: (title: string, description?: string, options?: Partial<ToastMessage>) => {
    const { addToast } = useToast();
    return addToast({ type: 'info', title, description, ...options });
  },
};

// Hook untuk mudah penggunaan
export function useToastHelpers() {
  const { addToast, removeToast, clearToasts } = useToast();

  const showSuccess = useCallback((title: string, description?: string) => {
    return addToast({ type: 'success', title, description });
  }, [addToast]);

  const showError = useCallback((title: string, description?: string) => {
    return addToast({ type: 'error', title, description });
  }, [addToast]);

  const showWarning = useCallback((title: string, description?: string) => {
    return addToast({ type: 'warning', title, description });
  }, [addToast]);

  const showInfo = useCallback((title: string, description?: string) => {
    return addToast({ type: 'info', title, description });
  }, [addToast]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearToasts,
  };
}