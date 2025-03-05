import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export const useAuth = () => {
  const { userId, role, isAuthenticated, login, logout } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await api.post("/logout");
      logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    userId,
    role,
    isAuthenticated,
    login,
    logout: handleLogout,
    loading
  };
};
