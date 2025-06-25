// hooks/index.ts

// Main auth hooks
export { useAuth } from './use-auth';
export { useAdminAuth } from './use-admin-auth';
export { usePengelolaAuth } from './use-pengelola-auth';

// Utility hooks
export { 
  useAuthRedirect, 
  useProtectedRoute, 
  useAuthPageRedirect,
  useRegistrationFlowRedirect 
} from './use-auth-redirect';

export { useLoading, useLoadingPattern } from './use-loading';

// Re-export store for direct access if needed
export { useAuthStore } from '@/store';