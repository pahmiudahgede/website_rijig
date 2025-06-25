// lib/middleware-config.ts
import type { UserRole, RegistrationStatus, TokenType } from '@/types/auth';

// Route patterns and their requirements
export interface RouteConfig {
  pattern: string;
  requiredRole?: UserRole;
  requireAuth: boolean;
  requireCompleteRegistration: boolean;
  allowPartialToken: boolean;
  redirectIfAuthenticated: boolean;
  publicRoute: boolean;
}

// Define route configurations
export const routeConfigs: RouteConfig[] = [
  // Public routes (landing page, etc)
  {
    pattern: '^/$',
    requireAuth: false,
    requireCompleteRegistration: false,
    allowPartialToken: true,
    redirectIfAuthenticated: false,
    publicRoute: true,
  },
  
  // Test connection route
  {
    pattern: '^/test-connection$',
    requireAuth: false,
    requireCompleteRegistration: false,
    allowPartialToken: true,
    redirectIfAuthenticated: false,
    publicRoute: true,
  },

  // Administrator auth routes
  {
    pattern: '^/sys-rijig-adminpanel/(auth|login|register)',
    requireAuth: false,
    requireCompleteRegistration: false,
    allowPartialToken: false,
    redirectIfAuthenticated: true,
    publicRoute: false,
    requiredRole: 'administrator',
  },

  // Administrator dashboard routes
  {
    pattern: '^/sys-rijig-adminpanel/dashboard',
    requireAuth: true,
    requireCompleteRegistration: true,
    allowPartialToken: false,
    redirectIfAuthenticated: false,
    publicRoute: false,
    requiredRole: 'administrator',
  },

  // Pengelola auth routes
  {
    pattern: '^/pengelola/(auth|login|register|otp)',
    requireAuth: false,
    requireCompleteRegistration: false,
    allowPartialToken: true,
    redirectIfAuthenticated: false, // Don't redirect, might be in registration flow
    publicRoute: false,
  },

  // Pengelola registration flow routes (require partial auth)
  {
    pattern: '^/pengelola/(company|approval|pin)',
    requireAuth: true,
    requireCompleteRegistration: false,
    allowPartialToken: true,
    redirectIfAuthenticated: false,
    publicRoute: false,
    requiredRole: 'pengelola',
  },

  // Pengelola dashboard routes
  {
    pattern: '^/pengelola/dashboard',
    requireAuth: true,
    requireCompleteRegistration: true,
    allowPartialToken: false,
    redirectIfAuthenticated: false,
    publicRoute: false,
    requiredRole: 'pengelola',
  },
];

// Get route config for a given pathname
export function getRouteConfig(pathname: string): RouteConfig | null {
  return routeConfigs.find(config => 
    new RegExp(config.pattern).test(pathname)
  ) || null;
}

// Default redirect paths based on role and registration status
export function getDefaultRedirectPath(
  role: UserRole | null,
  registrationStatus: RegistrationStatus | null,
  nextStep: string | null
): string {
  if (!role) return '/';

  if (role === 'administrator') {
    if (registrationStatus === 'complete') {
      return '/sys-rijig-adminpanel/dashboard';
    }
    return '/sys-rijig-adminpanel/login';
  }

  if (role === 'pengelola') {
    if (registrationStatus === 'complete') {
      return '/pengelola/dashboard';
    }

    // Handle registration flow based on next step
    switch (nextStep) {
      case 'complete_company_data':
        return '/pengelola/company';
      case 'awaiting_admin_approval':
      case 'wait_for_approval':
        return '/pengelola/approval';
      case 'create_pin':
        return '/pengelola/pin';
      case 'verif_pin':
        return '/pengelola/pin';
      default:
        return '/pengelola/login';
    }
  }

  return '/';
}

// Check if route is protected
export function isProtectedRoute(pathname: string): boolean {
  const config = getRouteConfig(pathname);
  return config ? !config.publicRoute : true; // Default to protected if no config found
}

// Routes that should be excluded from middleware
export const excludedPaths = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/static',
  '/images',
  '/fonts',
];

export function shouldProcessPath(pathname: string): boolean {
  return !excludedPaths.some(excluded => pathname.startsWith(excluded));
}