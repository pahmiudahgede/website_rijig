import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getRouteConfig,
  getDefaultRedirectPath,
  shouldProcessPath,
  isProtectedRoute
} from "@/lib/middleware-config";
import {
  extractUserInfoFromRequest,
  isAuthenticated,
  isRegistrationComplete,
  hasFullTokenAccess
} from "@/lib/jwt-utils";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip processing for excluded paths
  if (!shouldProcessPath(pathname)) {
    return NextResponse.next();
  }

  // Extract user information from request
  const userInfo = extractUserInfoFromRequest(request);
  const isUserAuthenticated = isAuthenticated(userInfo);
  const isRegComplete = isRegistrationComplete(userInfo);
  const hasFullToken = hasFullTokenAccess(userInfo);

  // Get route configuration
  const routeConfig = getRouteConfig(pathname);

  // If no route config found and it's a protected route, redirect to appropriate login
  if (!routeConfig && isProtectedRoute(pathname)) {
    if (!isUserAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If route config exists, apply the rules
  if (routeConfig) {
    // ✅ FIXED: Redirect authenticated users away from auth pages
    if (routeConfig.redirectIfAuthenticated && isUserAuthenticated) {
      // Don't redirect if they're on the correct role's auth page and not complete
      const isOnCorrectRoleAuthPage = (
        (userInfo.userRole === "administrator" && pathname.startsWith("/sys-rijig-adminpanel/")) ||
        (userInfo.userRole === "pengelola" && pathname.startsWith("/pengelola/"))
      );

      // Only redirect if registration is complete OR they're on wrong role's auth page
      if (isRegComplete || !isOnCorrectRoleAuthPage) {
        const redirectUrl = getDefaultRedirectPath(
          userInfo.userRole,
          userInfo.registrationStatus,
          userInfo.nextStep
        );
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }

    // Check if route requires authentication
    if (routeConfig.requireAuth && !isUserAuthenticated) {
      const redirectUrl = getDefaultRedirectPath(null, null, null);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // ✅ FIXED: Check if route requires specific role - with better error handling
    if (routeConfig.requiredRole && userInfo.userRole !== routeConfig.requiredRole) {
      // If user has wrong role, redirect them to their appropriate dashboard/login
      if (userInfo.userRole) {
        const redirectUrl = getDefaultRedirectPath(
          userInfo.userRole,
          userInfo.registrationStatus,
          userInfo.nextStep
        );
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      } else {
        // No role at all, send to landing page
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Check if route requires complete registration
    if (routeConfig.requireCompleteRegistration && !isRegComplete) {
      const redirectUrl = getDefaultRedirectPath(
        userInfo.userRole,
        userInfo.registrationStatus,
        userInfo.nextStep
      );
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Check if route requires full token (not partial)
    if (
      routeConfig.requireCompleteRegistration &&
      !routeConfig.allowPartialToken &&
      !hasFullToken
    ) {
      const redirectUrl = getDefaultRedirectPath(
        userInfo.userRole,
        userInfo.registrationStatus,
        userInfo.nextStep
      );
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // ✅ OPTIMIZED: Special handling for pengelola registration flow
  if (
    pathname.startsWith("/pengelola/") &&
    isUserAuthenticated &&
    userInfo.userRole === "pengelola"
  ) {
    const { registrationStatus, nextStep } = userInfo;

    // If user is trying to access wrong step in registration flow
    if (registrationStatus !== "complete") {
      const expectedPath = getDefaultRedirectPath(
        "pengelola",
        registrationStatus,
        nextStep
      );

      // Allow access to login/register routes during registration flow
      const isOnAuthRoute = pathname.match(/^\/pengelola\/(login|register|otp)$/);
      
      // Only redirect if they're not on the correct path and not on auth routes
      if (pathname !== expectedPath && !isOnAuthRoute) {
        return NextResponse.redirect(new URL(expectedPath, request.url));
      }
    }
  }

  // ✅ ADDED: Special handling for administrator
  if (
    pathname.startsWith("/sys-rijig-adminpanel/") &&
    isUserAuthenticated &&
    userInfo.userRole === "administrator"
  ) {
    const { registrationStatus } = userInfo;

    // Admin should go to dashboard if complete and trying to access login
    if (registrationStatus === "complete" && pathname.includes("/login")) {
      return NextResponse.redirect(new URL("/sys-rijig-adminpanel/dashboard", request.url));
    }
  }

  // Add security headers
  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Add user info to headers for client-side use (optional)
  if (isUserAuthenticated) {
    response.headers.set("X-User-Role", userInfo.userRole || "");
    response.headers.set(
      "X-Registration-Status",
      userInfo.registrationStatus || ""
    );
    response.headers.set("X-Token-Type", userInfo.tokenType || "");
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|static|images|fonts).*)"
  ]
};