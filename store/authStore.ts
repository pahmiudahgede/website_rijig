// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, LoginRequest } from "@/services/authService";

interface AuthState {
  userId: string | null;
  role: "admin" | "pengelola" | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      role: null,
      token: null,
      isAuthenticated: false,

      login: async (data) => {
        try {
          const userData = await loginUser(data);
          const role = userData.role_name === "administrator" ? "admin" : "pengelola";

          set({
            userId: userData.user_id,
            role,
            token: userData.token,
            isAuthenticated: true,
          });

          localStorage.setItem("token", userData.token); // Simpan token di localStorage
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },

      logout: () => {
        // Reset state
        set({ userId: null, role: null, token: null, isAuthenticated: false });
        localStorage.removeItem("token"); // Hapus token dari localStorage saat logout
      },
    }),
    { name: "auth-store" }
  )
);
