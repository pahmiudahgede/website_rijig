"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getDashboardUrl = () => {
    if (!user) return "/auth/login";
    
    if (user.role === "administrator") {
      return "/sys-admin-portal/dashboard";
    }
    
    if (user.role === "pengelola" && user.registration_status === "complete") {
      return "/pengelola/dashboard";
    }
    
    return "/auth/login";
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            Rijig
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Halo, {user.role === "administrator" ? "Admin" : "Pengelola"}
                </span>
                <Link
                  href={getDashboardUrl()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/pengelola/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Let's Get Started!
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}