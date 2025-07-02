import type { UserRole, RegistrationStatus, TokenType } from "@/types/auth";

export interface RouteConfig {
  pattern: string;
  requiredRole?: UserRole;
  requireAuth: boolean;
  requireCompleteRegistration: boolean;
  allowPartialToken: boolean;
  redirectIfAuthenticated: boolean;
  publicRoute: boolean;
}

export const routeConfigs: RouteConfig[] = [
  {
    pattern: "^/$",
    requireAuth: false,
    requireCompleteRegistration: false,
    allowPartialToken: true,
    redirectIfAuthenticated: false,
    publicRoute: true
  },

  {
    pattern: "^/test-connection$",
    requireAuth: false,
    requireCompleteRegistration: false,
    allowPartialToken: true,
    redirectIfAuthenticated: false,
    publicRoute: true
  },

  // ✅ FIXED: Correct pattern for admin auth routes
  {
    pattern: "^/sys-rijig-adminpanel/(login|register)$",
    requireAuth: false,
    requireCompleteRegistration: false,
    allowPartialToken: false,
    redirectIfAuthenticated: true,
    publicRoute: false,
    requiredRole: "administrator"
  },

  {
    pattern: "^/sys-rijig-adminpanel/dashboard",
    requireAuth: true,
    requireCompleteRegistration: true,
    allowPartialToken: false,
    redirectIfAuthenticated: false,
    publicRoute: false,
    requiredRole: "administrator"
  },

  // ✅ FIXED: Correct pattern for pengelola auth routes  
  {
    pattern: "^/pengelola/(login|register|otp)$",
    requireAuth: false,
    requireCompleteRegistration: false,
    allowPartialToken: true,
    redirectIfAuthenticated: false,
    publicRoute: false
  },

  {
    pattern: "^/pengelola/(company|approval|pin)$",
    requireAuth: true,
    requireCompleteRegistration: false,
    allowPartialToken: true,
    redirectIfAuthenticated: false,
    publicRoute: false,
    requiredRole: "pengelola"
  },

  {
    pattern: "^/pengelola/dashboard",
    requireAuth: true,
    requireCompleteRegistration: true,
    allowPartialToken: false,
    redirectIfAuthenticated: false,
    publicRoute: false,
    requiredRole: "pengelola"
  }
];

export function getRouteConfig(pathname: string): RouteConfig | null {
  return (
    routeConfigs.find((config) => new RegExp(config.pattern).test(pathname)) ||
    null
  );
}

export function getDefaultRedirectPath(
  role: UserRole | null,
  registrationStatus: RegistrationStatus | null,
  nextStep: string | null
): string {
  if (!role) return "/";

  if (role === "administrator") {
    if (registrationStatus === "complete") {
      return "/sys-rijig-adminpanel/dashboard";
    }
    return "/sys-rijig-adminpanel/login";
  }

  if (role === "pengelola") {
    if (registrationStatus === "complete") {
      return "/pengelola/dashboard";
    }

    switch (nextStep) {
      case "complete_company_data":
        return "/pengelola/company";
      case "awaiting_admin_approval":
      case "wait_for_approval":
        return "/pengelola/approval";
      case "create_pin":
        return "/pengelola/pin";
      case "verif_pin":
        return "/pengelola/pin";
      default:
        return "/pengelola/login";
    }
  }

  return "/";
}

export function isProtectedRoute(pathname: string): boolean {
  const config = getRouteConfig(pathname);
  return config ? !config.publicRoute : true;
}

export const excludedPaths = [
  "/_next",
  "/api",
  "/favicon.ico",
  "/static",
  "/images",
  "/fonts"
];

export function shouldProcessPath(pathname: string): boolean {
  return !excludedPaths.some((excluded) => pathname.startsWith(excluded));
}