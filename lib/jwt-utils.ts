// lib/jwt-utils.ts
import type { UserRole, RegistrationStatus, TokenType } from '@/types/auth';

export interface TokenPayload {
  role: UserRole;
  registration_status: RegistrationStatus;
  token_type: TokenType;
  next_step?: string;
  session_id: string;
  exp: number;
  iat: number;
}

/**
 * Decode JWT token without verification (for middleware use)
 * Note: This is for reading claims only, not for verification
 */
export function decodeJWT(token: string): TokenPayload | null {
  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Decode the payload (base64url)
    const payload = parts[1];
    const decoded = base64UrlDecode(payload);
    const parsed = JSON.parse(decoded);

    return parsed as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Base64URL decode function
 */
function base64UrlDecode(str: string): string {
  // Add padding if needed
  str += '='.repeat((4 - str.length % 4) % 4);
  
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Decode base64
  return atob(str);
}

/**
 * Check if token is expired
 */
export function isTokenExpired(payload: TokenPayload): boolean {
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Extract user info from request cookies/headers
 */
export function extractUserInfoFromRequest(request: Request): {
  accessToken: string | null;
  refreshToken: string | null;
  userRole: UserRole | null;
  registrationStatus: RegistrationStatus | null;
  tokenType: TokenType | null;
  nextStep: string | null;
  sessionId: string | null;
} {
  const cookieHeader = request.headers.get('cookie');
  
  if (!cookieHeader) {
    return {
      accessToken: null,
      refreshToken: null,
      userRole: null,
      registrationStatus: null,
      tokenType: null,
      nextStep: null,
      sessionId: null,
    };
  }

  // Parse cookies
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(cookie => {
      const [key, value] = cookie.trim().split('=');
      return [key, value];
    })
  );

  const accessToken = cookies.access_token || null;
  let userRole: UserRole | null = null;
  let registrationStatus: RegistrationStatus | null = null;
  let tokenType: TokenType | null = null;
  let nextStep: string | null = null;
  let sessionId: string | null = null;

  // Try to extract info from access token
  if (accessToken) {
    const payload = decodeJWT(accessToken);
    if (payload && !isTokenExpired(payload)) {
      userRole = payload.role;
      registrationStatus = payload.registration_status;
      tokenType = payload.token_type;
      nextStep = payload.next_step || null;
      sessionId = payload.session_id;
    }
  }

  // Fallback to individual cookies if token decode fails
  if (!userRole) {
    userRole = (cookies.user_role as UserRole) || null;
    registrationStatus = (cookies.registration_status as RegistrationStatus) || null;
    tokenType = (cookies.token_type as TokenType) || null;
    nextStep = cookies.next_step || null;
    sessionId = cookies.session_id || null;
  }

  return {
    accessToken,
    refreshToken: cookies.refresh_token || null,
    userRole,
    registrationStatus,
    tokenType,
    nextStep,
    sessionId,
  };
}

/**
 * Check if user is authenticated based on extracted info
 */
export function isAuthenticated(userInfo: ReturnType<typeof extractUserInfoFromRequest>): boolean {
  return !!userInfo.accessToken && !!userInfo.userRole;
}

/**
 * Check if registration is complete
 */
export function isRegistrationComplete(userInfo: ReturnType<typeof extractUserInfoFromRequest>): boolean {
  return userInfo.registrationStatus === 'complete';
}

/**
 * Check if user has full token access
 */
export function hasFullTokenAccess(userInfo: ReturnType<typeof extractUserInfoFromRequest>): boolean {
  return userInfo.tokenType === 'full';
}