// utils/auth-sync.ts
import type { UserRole, RegistrationStatus, TokenType } from '@/types/auth';

/**
 * Sync auth data to cookies for middleware access
 */
export function syncAuthToCookies(authData: {
  access_token?: string;
  refresh_token?: string;
  user_role?: UserRole;
  registration_status?: RegistrationStatus;
  token_type?: TokenType;
  next_step?: string;
  session_id?: string;
}): void {
  if (typeof window === 'undefined') return;

  const cookieOptions = 'path=/; secure; samesite=lax';

  Object.entries(authData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      document.cookie = `${key}=${encodeURIComponent(value)}; ${cookieOptions}`;
    }
  });
}

/**
 * Clear auth cookies
 */
export function clearAuthCookies(): void {
  if (typeof window === 'undefined') return;

  const cookiesToClear = [
    'access_token',
    'refresh_token', 
    'user_role',
    'registration_status',
    'token_type',
    'next_step',
    'session_id',
  ];

  cookiesToClear.forEach(cookie => {
    document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
}

/**
 * Enhanced localStorage setter that also syncs to cookies
 */
export function setAuthData(key: string, value: string): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(key, value);

  // Also set cookie for middleware access
  const cookieOptions = 'path=/; secure; samesite=lax';
  document.cookie = `${key}=${encodeURIComponent(value)}; ${cookieOptions}`;
}

/**
 * Enhanced localStorage remover that also clears cookies
 */
export function removeAuthData(key: string): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(key);
  
  // Also clear cookie
  document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Sync all current auth state to cookies
 */
export function syncCurrentAuthState(): void {
  if (typeof window === 'undefined') return;

  const authData = {
    access_token: localStorage.getItem('access_token') || undefined,
    refresh_token: localStorage.getItem('refresh_token') || undefined,
    user_role: (localStorage.getItem('user_role') as UserRole) || undefined,
    registration_status: (localStorage.getItem('registration_status') as RegistrationStatus) || undefined,
    token_type: (localStorage.getItem('token_type') as TokenType) || undefined,
    next_step: localStorage.getItem('next_step') || undefined,
    session_id: localStorage.getItem('session_id') || undefined,
  };

  // Filter out undefined values
  const filteredAuthData = Object.fromEntries(
    Object.entries(authData).filter(([_, value]) => value !== undefined)
  );

  syncAuthToCookies(filteredAuthData);
}

/**
 * Initialize auth sync - call this on app startup
 */
export function initializeAuthSync(): void {
  if (typeof window === 'undefined') return;

  // Sync current state to cookies
  syncCurrentAuthState();

  // Listen for localStorage changes and sync to cookies
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('access_token') || 
        e.key === 'refresh_token' ||
        e.key === 'user_role' ||
        e.key === 'registration_status' ||
        e.key === 'token_type' ||
        e.key === 'next_step' ||
        e.key === 'session_id') {
      
      if (e.newValue) {
        setAuthData(e.key, e.newValue);
      } else {
        removeAuthData(e.key);
      }
    }
  });
}

/**
 * Read auth state from server headers (set by middleware)
 */
export function getServerAuthState(): {
  userRole: UserRole | null;
  registrationStatus: RegistrationStatus | null;
  tokenType: TokenType | null;
} {
  if (typeof window === 'undefined') {
    return {
      userRole: null,
      registrationStatus: null,
      tokenType: null,
    };
  }

  // These would be set by middleware if available
  const userRole = document.querySelector('meta[name="x-user-role"]')?.getAttribute('content') as UserRole || null;
  const registrationStatus = document.querySelector('meta[name="x-registration-status"]')?.getAttribute('content') as RegistrationStatus || null;
  const tokenType = document.querySelector('meta[name="x-token-type"]')?.getAttribute('content') as TokenType || null;

  return {
    userRole,
    registrationStatus,
    tokenType,
  };
}