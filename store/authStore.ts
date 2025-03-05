import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null;
  token: string | null;
  login: (userId: string, role: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  role: null,
  token: null,
  login: (userId, role, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
    }

    set({ isAuthenticated: true, userId, role, token });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    }

    set({ isAuthenticated: false, userId: null, role: null, token: null });
  }
}));

if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (token && userId && role) {
    useAuthStore.setState({ isAuthenticated: true, userId, role, token });
  }
}
