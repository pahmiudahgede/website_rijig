import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/auth.types";
import { authCommonService } from "@/services/auth/common.service";
import { AUTH_STORAGE_KEY } from "@/lib/constants";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  updateTokens: (access_token: string, refresh_token?: string) => void;
  updateUser: (updates: Partial<User>) => void;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initialize: () => void;
}

// Helper function to sync with cookies
const syncWithCookie = (state: any) => {
  if (typeof window !== 'undefined') {
    const authData = { state: { user: state.user } };
    // Set cookie for middleware access
    document.cookie = `auth-storage=${encodeURIComponent(JSON.stringify(authData))}; path=/; max-age=86400; SameSite=Strict`;
  }
};

// Helper function to clear cookie
const clearCookie = () => {
  if (typeof window !== 'undefined') {
    document.cookie = 'auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      setUser: (user) => {
        set({ user, error: null });
        syncWithCookie({ user });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setInitialized: (initialized) => set({ isInitialized: initialized }),

      updateTokens: (access_token, refresh_token) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            access_token,
            refresh_token: refresh_token || currentUser.refresh_token
          };
          set({ user: updatedUser });
          syncWithCookie({ user: updatedUser });
        }
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            ...updates
          };
          set({ user: updatedUser });
          syncWithCookie({ user: updatedUser });
        }
      },

      refreshToken: async () => {
        const currentUser = get().user;
        if (!currentUser?.refresh_token) {
          throw new Error("No refresh token available");
        }

        try {
          set({ isLoading: true });
          const response = await authCommonService.refreshToken(
            currentUser.refresh_token
          );

          if (response.data?.data) {
            const { access_token, refresh_token, token_type, registration_status, session_id } = response.data.data;
            
            const updatedUser = {
              ...currentUser,
              access_token,
              refresh_token: refresh_token || currentUser.refresh_token,
              token_type: token_type as any,
              registration_status: registration_status as any,
              session_id: session_id || currentUser.session_id
            };
            
            set({ user: updatedUser });
            syncWithCookie({ user: updatedUser });
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          // Call logout API if user exists
          const currentUser = get().user;
          if (currentUser) {
            await authCommonService.logout();
          }
        } catch (error) {
          console.error('Logout API call failed:', error);
        } finally {
          const role = get().user?.role;
          
          // Clear state
          set({ user: null, error: null, isLoading: false });
          
          // Clear cookie
          clearCookie();

          // Clear session storage
          if (typeof window !== "undefined") {
            sessionStorage.removeItem('device_id');
            
            // Fix redirect paths to match actual routes
            if (role === "administrator") {
              window.location.href = "/sys-rijig-adminpanel/login";
            } else {
              window.location.href = "/pengelola/login";
            }
          }
        }
      },

      clearError: () => set({ error: null }),

      initialize: () => {
        // Sync initial state with cookie
        const state = get();
        if (state.user) {
          syncWithCookie({ user: state.user });
        }
        set({ isInitialized: true });
      }
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isInitialized: state.isInitialized 
      }),
      onRehydrateStorage: () => (state) => {
        // Called when store is rehydrated from localStorage
        if (state) {
          state.isInitialized = true;
          // Sync with cookie on rehydration
          if (state.user) {
            syncWithCookie({ user: state.user });
          }
        }
      }
    }
  )
);