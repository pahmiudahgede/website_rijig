// store/index.ts
export { useAuthStore } from './auth.store';

// Re-export store types for convenience
export type {
  AuthState,
  AuthUser,
  LoadingStates,
  ErrorStates,
  RegistrationTemp,
} from './types/auth.types';

export type { AuthActions } from './types/auth.actions';