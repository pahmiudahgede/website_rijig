import { User, UserRole } from "@/types/auth.types";

export const isRegistrationComplete = (user: User): boolean => {
  if (user.role === "administrator") {
    return user.registration_status === "completed";
  }
  
  if (user.role === "pengelola") {
    return user.registration_status === "complete" && user.token_type === "full";
  }
  
  return false;
};

export const getNextStepUrl = (user: User): string => {
  if (user.role === "administrator") {
    return "/sys-rijig-adminpanel/dashboard";
  }
  
  if (user.role === "pengelola") {
    switch (user.registration_status) {
      case "uncomplete":
        return "/pengelola/company";
      case "awaiting_approval":
        return "/pengelola/approval";
      case "approved":
        return "/pengelola/pin";
      case "complete":
        return user.token_type === "full" 
          ? "/pengelola/dashboard" 
          : "/pengelola/pin";
      default:
        return "/pengelola/register";
    }
  }
  
  return "/";
};

export const getLoginUrl = (role: UserRole): string => {
  return role === "administrator" 
    ? "/sys-rijig-adminpanel/login" 
    : "/pengelola/login";
};

export const getDashboardUrl = (role: UserRole): string => {
  return role === "administrator" 
    ? "/sys-rijig-adminpanel/dashboard" 
    : "/pengelola/dashboard";
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const parseJWTPayload = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};
