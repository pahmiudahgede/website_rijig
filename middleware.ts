// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// // Define protected routes that require authentication
// const protectedRoutes = {
//   administrator: ['/sys-rijig-adminpanel/dashboard'],
//   pengelola: ['/pengelola/dashboard', '/pengelola/company', '/pengelola/approval', '/pengelola/pin'],
// };

// // Define auth routes (accessible only when NOT authenticated)
// const authRoutes = {
//   administrator: ['/sys-rijig-adminpanel/login', '/sys-rijig-adminpanel/register'],
//   pengelola: ['/pengelola/login', '/pengelola/register', '/pengelola/otp'],
// };

// // Define routes that require specific registration status
// const registrationRoutes = {
//   pengelola: {
//     uncomplete: ['/pengelola/company'],
//     awaiting_approval: ['/pengelola/approval'],
//     approved: ['/pengelola/pin'],
//     complete: ['/pengelola/dashboard'],
//   }
// };

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   // Get auth data from cookie (localStorage is not accessible in middleware)
//   const authCookie = request.cookies.get('auth-storage');
  
//   if (!authCookie) {
//     // No auth data, check if trying to access protected routes
//     const isProtected = Object.entries(protectedRoutes).some(([_, routes]) => 
//       routes.some(route => pathname.startsWith(route))
//     );
    
//     if (isProtected) {
//       // Redirect to appropriate login page
//       if (pathname.startsWith('/sys-rijig-adminpanel')) {
//         return NextResponse.redirect(new URL('/sys-rijig-adminpanel/login', request.url));
//       } else if (pathname.startsWith('/pengelola')) {
//         return NextResponse.redirect(new URL('/pengelola/login', request.url));
//       }
//     }
    
//     return NextResponse.next();
//   }
  
//   try {
//     const authData = JSON.parse(authCookie.value);
//     const user = authData.state?.user;
    
//     if (!user) {
//       // Invalid auth data
//       const response = NextResponse.next();
//       response.cookies.delete('auth-storage');
//       return response;
//     }
    
//     // Check if user is trying to access auth routes while authenticated
//     if (user.role === 'administrator' && authRoutes.administrator.some(route => pathname === route)) {
//       return NextResponse.redirect(new URL('/sys-rijig-adminpanel/dashboard', request.url));
//     }
    
//     if (user.role === 'pengelola' && authRoutes.pengelola.some(route => pathname === route)) {
//       // For pengelola, redirect based on registration status
//       if (user.registration_status === 'complete' && user.token_type === 'full') {
//         return NextResponse.redirect(new URL('/pengelola/dashboard', request.url));
//       }
//     }
    
//     // For pengelola, enforce registration flow
//     if (user.role === 'pengelola' && pathname.startsWith('/pengelola')) {
//       const status = user.registration_status;
//       const tokenType = user.token_type;
      
//       // If trying to access dashboard without full token
//       if (pathname === '/pengelola/dashboard' && (status !== 'complete' || tokenType !== 'full')) {
//         // Redirect to appropriate step
//         if (status === 'uncomplete') {
//           return NextResponse.redirect(new URL('/pengelola/company', request.url));
//         } else if (status === 'awaiting_approval') {
//           return NextResponse.redirect(new URL('/pengelola/approval', request.url));
//         } else if (status === 'approved') {
//           return NextResponse.redirect(new URL('/pengelola/pin', request.url));
//         }
//       }
      
//       // Prevent skipping steps
//       if (status === 'uncomplete' && !pathname.includes('/company') && !pathname.includes('/otp')) {
//         return NextResponse.redirect(new URL('/pengelola/company', request.url));
//       }
      
//       if (status === 'awaiting_approval' && !pathname.includes('/approval')) {
//         return NextResponse.redirect(new URL('/pengelola/approval', request.url));
//       }
      
//       if (status === 'approved' && tokenType === 'partial' && !pathname.includes('/pin')) {
//         return NextResponse.redirect(new URL('/pengelola/pin', request.url));
//       }
//     }
    
//     // Check role-based access
//     if (pathname.startsWith('/sys-rijig-adminpanel') && user.role !== 'administrator') {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
    
//     if (pathname.startsWith('/pengelola') && user.role !== 'pengelola') {
//       return NextResponse.redirect(new URL('/', request.url));
//     }
    
//     return NextResponse.next();
    
//   } catch (error) {
//     // Invalid cookie data
//     const response = NextResponse.next();
//     response.cookies.delete('auth-storage');
//     return response;
//   }
// }

// export const config = {
//   matcher: [
//     '/sys-rijig-adminpanel/:path*',
//     '/pengelola/:path*',
//   ],
// };



// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getRouteConfig,
  getDefaultRedirectPath,
  shouldProcessPath,
  isProtectedRoute,
} from '@/lib/middleware-config';
import {
  extractUserInfoFromRequest,
  isAuthenticated,
  isRegistrationComplete,
  hasFullTokenAccess,
} from '@/lib/jwt-utils';

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
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If route config exists, apply the rules
  if (routeConfig) {
    // Check if route requires authentication
    if (routeConfig.requireAuth && !isUserAuthenticated) {
      const redirectUrl = getDefaultRedirectPath(null, null, null);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Check if route requires specific role
    if (routeConfig.requiredRole && userInfo.userRole !== routeConfig.requiredRole) {
      const redirectUrl = getDefaultRedirectPath(
        userInfo.userRole,
        userInfo.registrationStatus,
        userInfo.nextStep
      );
      return NextResponse.redirect(new URL(redirectUrl, request.url));
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
    if (routeConfig.requireCompleteRegistration && !routeConfig.allowPartialToken && !hasFullToken) {
      const redirectUrl = getDefaultRedirectPath(
        userInfo.userRole,
        userInfo.registrationStatus,
        userInfo.nextStep
      );
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Redirect authenticated users away from auth pages
    if (routeConfig.redirectIfAuthenticated && isUserAuthenticated && isRegComplete) {
      const redirectUrl = getDefaultRedirectPath(
        userInfo.userRole,
        userInfo.registrationStatus,
        userInfo.nextStep
      );
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Special handling for pengelola registration flow
  if (pathname.startsWith('/pengelola/') && isUserAuthenticated && userInfo.userRole === 'pengelola') {
    const { registrationStatus, nextStep } = userInfo;

    // If user is trying to access wrong step in registration flow
    if (registrationStatus !== 'complete') {
      const expectedPath = getDefaultRedirectPath('pengelola', registrationStatus, nextStep);
      
      // Only redirect if they're not already on the correct path
      if (pathname !== expectedPath && !pathname.startsWith('/pengelola/login') && !pathname.startsWith('/pengelola/register')) {
        return NextResponse.redirect(new URL(expectedPath, request.url));
      }
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add user info to headers for client-side use (optional)
  if (isUserAuthenticated) {
    response.headers.set('X-User-Role', userInfo.userRole || '');
    response.headers.set('X-Registration-Status', userInfo.registrationStatus || '');
    response.headers.set('X-Token-Type', userInfo.tokenType || '');
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
    '/((?!api|_next/static|_next/image|favicon.ico|static|images|fonts).*)',
  ],
};