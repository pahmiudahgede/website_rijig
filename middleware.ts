import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = {
  administrator: ['/sys-rijig-adminpanel/dashboard'],
  pengelola: ['/pengelola/dashboard', '/pengelola/company', '/pengelola/approval', '/pengelola/pin'],
};

// Define auth routes (accessible only when NOT authenticated)
const authRoutes = {
  administrator: ['/sys-rijig-adminpanel/login', '/sys-rijig-adminpanel/register'],
  pengelola: ['/pengelola/login', '/pengelola/register', '/pengelola/otp'],
};

// Define routes that require specific registration status
const registrationRoutes = {
  pengelola: {
    uncomplete: ['/pengelola/company'],
    awaiting_approval: ['/pengelola/approval'],
    approved: ['/pengelola/pin'],
    complete: ['/pengelola/dashboard'],
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth data from cookie (localStorage is not accessible in middleware)
  const authCookie = request.cookies.get('auth-storage');
  
  if (!authCookie) {
    // No auth data, check if trying to access protected routes
    const isProtected = Object.entries(protectedRoutes).some(([_, routes]) => 
      routes.some(route => pathname.startsWith(route))
    );
    
    if (isProtected) {
      // Redirect to appropriate login page
      if (pathname.startsWith('/sys-rijig-adminpanel')) {
        return NextResponse.redirect(new URL('/sys-rijig-adminpanel/login', request.url));
      } else if (pathname.startsWith('/pengelola')) {
        return NextResponse.redirect(new URL('/pengelola/login', request.url));
      }
    }
    
    return NextResponse.next();
  }
  
  try {
    const authData = JSON.parse(authCookie.value);
    const user = authData.state?.user;
    
    if (!user) {
      // Invalid auth data
      const response = NextResponse.next();
      response.cookies.delete('auth-storage');
      return response;
    }
    
    // Check if user is trying to access auth routes while authenticated
    if (user.role === 'administrator' && authRoutes.administrator.some(route => pathname === route)) {
      return NextResponse.redirect(new URL('/sys-rijig-adminpanel/dashboard', request.url));
    }
    
    if (user.role === 'pengelola' && authRoutes.pengelola.some(route => pathname === route)) {
      // For pengelola, redirect based on registration status
      if (user.registration_status === 'complete' && user.token_type === 'full') {
        return NextResponse.redirect(new URL('/pengelola/dashboard', request.url));
      }
    }
    
    // For pengelola, enforce registration flow
    if (user.role === 'pengelola' && pathname.startsWith('/pengelola')) {
      const status = user.registration_status;
      const tokenType = user.token_type;
      
      // If trying to access dashboard without full token
      if (pathname === '/pengelola/dashboard' && (status !== 'complete' || tokenType !== 'full')) {
        // Redirect to appropriate step
        if (status === 'uncomplete') {
          return NextResponse.redirect(new URL('/pengelola/company', request.url));
        } else if (status === 'awaiting_approval') {
          return NextResponse.redirect(new URL('/pengelola/approval', request.url));
        } else if (status === 'approved') {
          return NextResponse.redirect(new URL('/pengelola/pin', request.url));
        }
      }
      
      // Prevent skipping steps
      if (status === 'uncomplete' && !pathname.includes('/company') && !pathname.includes('/otp')) {
        return NextResponse.redirect(new URL('/pengelola/company', request.url));
      }
      
      if (status === 'awaiting_approval' && !pathname.includes('/approval')) {
        return NextResponse.redirect(new URL('/pengelola/approval', request.url));
      }
      
      if (status === 'approved' && tokenType === 'partial' && !pathname.includes('/pin')) {
        return NextResponse.redirect(new URL('/pengelola/pin', request.url));
      }
    }
    
    // Check role-based access
    if (pathname.startsWith('/sys-rijig-adminpanel') && user.role !== 'administrator') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (pathname.startsWith('/pengelola') && user.role !== 'pengelola') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();
    
  } catch (error) {
    // Invalid cookie data
    const response = NextResponse.next();
    response.cookies.delete('auth-storage');
    return response;
  }
}

export const config = {
  matcher: [
    '/sys-rijig-adminpanel/:path*',
    '/pengelola/:path*',
  ],
};