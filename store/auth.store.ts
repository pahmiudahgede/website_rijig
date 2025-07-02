import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  AdminAuthService,
  PengelolaAuthService,
  CommonAuthService
} from "@/services/auth";
import { syncAuthToCookies } from "@/utils/auth-sync";
import type { AuthState } from "./types/auth.types";
import type { AuthActions as ActionsType } from "./types/auth.actions";

const initialState: AuthState = {
  user: {
    role: null,
    registrationStatus: null,
    tokenType: null,
    nextStep: null,
    sessionId: null,
    isAuthenticated: false
  },
  tempData: {
    phone: null,
    email: null,
    otp: null
  },
  loading: {
    login: false,
    register: false,
    otpRequest: false,
    otpVerify: false,
    companyProfile: false,
    pinCreate: false,
    pinVerify: false,
    approvalCheck: false,
    logout: false,
    refreshToken: false
  },
  errors: {
    login: null,
    register: null,
    otpRequest: null,
    otpVerify: null,
    companyProfile: null,
    pinCreate: null,
    pinVerify: null,
    approvalCheck: null,
    logout: null,
    general: null
  },
  isInitialized: false
};

/**
 * Helper function to sync user state to cookies
 */
const syncUserStateToCookies = (user: AuthState["user"]) => {
  if (user.isAuthenticated) {
    syncAuthToCookies({
      user_role: user.role || undefined,
      registration_status: user.registrationStatus || undefined,
      token_type: user.tokenType || undefined,
      next_step: user.nextStep || undefined,
      session_id: user.sessionId || undefined
    });
  }
};

export const useAuthStore = create<AuthState & ActionsType>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ✅ FIXED: Initialize auth state from localStorage AND sync to cookies
        initializeAuth: () => {
          const authState = CommonAuthService.getAuthState();
          const newUserState = {
            role: authState.userRole as any,
            registrationStatus: authState.registrationStatus as any,
            tokenType: authState.tokenType as any,
            nextStep: authState.nextStep,
            sessionId:
              typeof window !== "undefined"
                ? localStorage.getItem("session_id")
                : null,
            isAuthenticated: authState.isAuthenticated
          };

          set({
            user: newUserState,
            isInitialized: true
          });

          // ✅ FIX: Sync to cookies after initialization
          syncUserStateToCookies(newUserState);
        },

        // Administrator Actions
        adminRegister: async (data) => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, register: true },
            errors: { ...state.errors, register: null }
          }));

          try {
            const result = await AdminAuthService.register(data);
            set((state) => ({
              ...state,
              loading: { ...state.loading, register: false }
            }));
            return result;
          } catch (error: any) {
            set((state) => ({
              ...state,
              loading: { ...state.loading, register: false },
              errors: { ...state.errors, register: error.message }
            }));
            throw error;
          }
        },

        adminLogin: async (credentials) => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, login: true },
            errors: { ...state.errors, login: null }
          }));

          try {
            const result = await AdminAuthService.login(credentials);
            const newUserState = result.data
              ? {
                  role: "administrator" as const,
                  registrationStatus: result.data.registration_status,
                  tokenType: result.data.token_type || null,
                  nextStep: result.data.next_step || null,
                  sessionId: result.data.session_id,
                  isAuthenticated: true
                }
              : get().user;

            set((state) => ({
              ...state,
              loading: { ...state.loading, login: false },
              user: newUserState
            }));

            // ✅ FIX: Sync to cookies after login
            syncUserStateToCookies(newUserState);

            return result;
          } catch (error: any) {
            set((state) => ({
              ...state,
              loading: { ...state.loading, login: false },
              errors: { ...state.errors, login: error.message }
            }));
            throw error;
          }
        },

        // Pengelola Registration Actions
        requestOtpRegister: async (phone) => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, otpRequest: true },
            errors: { ...state.errors, otpRequest: null },
            tempData: { ...state.tempData, phone }
          }));

          try {
            const result = await PengelolaAuthService.requestOtpRegister(phone);
            set((state) => ({
              ...state,
              loading: { ...state.loading, otpRequest: false }
            }));
            return result;
          } catch (error: any) {
            set((state) => ({
              ...state,
              loading: { ...state.loading, otpRequest: false },
              errors: { ...state.errors, otpRequest: error.message }
            }));
            throw error;
          }
        },

        verifyOtpRegister: async (phone, otp) => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, otpVerify: true },
            errors: { ...state.errors, otpVerify: null },
            tempData: { ...state.tempData, otp }
          }));

          try {
            const result = await PengelolaAuthService.verifyOtpRegister(
              phone,
              otp
            );
            const newUserState = result.data
              ? {
                  role: "pengelola" as const,
                  registrationStatus: result.data.registration_status,
                  tokenType: result.data.token_type || null,
                  nextStep: result.data.next_step || null,
                  sessionId: result.data.session_id,
                  isAuthenticated: true
                }
              : get().user;

            set((state) => ({
              ...state,
              loading: { ...state.loading, otpVerify: false },
              user: newUserState
            }));

            // ✅ FIX: Sync to cookies
            syncUserStateToCookies(newUserState);

            return result;
          } catch (error: any) {
            set((state) => ({
              ...state,
              loading: { ...state.loading, otpVerify: false },
              errors: { ...state.errors, otpVerify: error.message }
            }));
            throw error;
          }
        },

        createCompanyProfile: async (data) => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, companyProfile: true },
            errors: { ...state.errors, companyProfile: null }
          }));

          try {
            const result = await PengelolaAuthService.createCompanyProfile(
              data
            );
            const newUserState = result.data
              ? {
                  ...get().user,
                  registrationStatus: result.data.registration_status,
                  nextStep: result.data.next_step || null,
                  tokenType: result.data.token_type || null
                }
              : get().user;

            set((state) => ({
              ...state,
              loading: { ...state.loading, companyProfile: false },
              user: newUserState
            }));

            // ✅ FIX: Sync to cookies
            syncUserStateToCookies(newUserState);

            return result;
          } catch (error: any) {
            set((state) => ({
              ...state,
              loading: { ...state.loading, companyProfile: false },
              errors: { ...state.errors, companyProfile: error.message }
            }));
            throw error;
          }
        },

        checkApprovalStatus: async () => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, approvalCheck: true },
            errors: { ...state.errors, approvalCheck: null }
          }));

          try {
            const result = await PengelolaAuthService.checkApprovalStatus();
            const newUserState = result.data
              ? {
                  ...get().user,
                  registrationStatus: result.data.registration_status,
                  nextStep: result.data.next_step,
                  tokenType: result.data.token_type || get().user.tokenType,
                  sessionId: result.data.session_id || get().user.sessionId
                }
              : get().user;

            set((state) => ({
              ...state,
              loading: { ...state.loading, approvalCheck: false },
              user: newUserState
            }));

            // ✅ FIX: Sync to cookies
            syncUserStateToCookies(newUserState);

            return result;
          } catch (error: any) {
            set((state) => ({
              ...state,
              loading: { ...state.loading, approvalCheck: false },
              errors: { ...state.errors, approvalCheck: error.message }
            }));
            throw error;
          }
        },

        createPin: async (pin) => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, pinCreate: true },
            errors: { ...state.errors, pinCreate: null }
          }));

          try {
            const result = await PengelolaAuthService.createPin(pin);
            const newUserState = result.data
              ? {
                  ...get().user,
                  registrationStatus: result.data.registration_status,
                  nextStep: result.data.next_step || null,
                  tokenType: result.data.token_type || null
                }
              : get().user;

            set((state) => ({
              ...state,
              loading: { ...state.loading, pinCreate: false },
              user: newUserState
            }));

            // ✅ FIX: Sync to cookies
            syncUserStateToCookies(newUserState);

            return result;
          } catch (error: any) {
            set((state) => ({
              ...state,
              loading: { ...state.loading, pinCreate: false },
              errors: { ...state.errors, pinCreate: error.message }
            }));
            throw error;
          }
        },

        // Pengelola Login Actions
        requestOtpLogin: async (phone) => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, otpRequest: true },
            errors: { ...state.errors, otpRequest: null },
            tempData: { ...state.tempData, phone }
          }));

          try {
            const result = await PengelolaAuthService.requestOtpLogin(phone);
            set((state) => ({
              ...state,
              loading: { ...state.loading, otpRequest: false }
            }));
            return result;
          } catch (error: any) {
            set((state) => ({
              ...state,
              loading: { ...state.loading, otpRequest: false },
              errors: { ...state.errors, otpRequest: error.message }
            }));
            throw error;
          }
        },

        verifyOtpLogin: async (phone, otp) => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, otpVerify: true },
            errors: { ...state.errors, otpVerify: null }
          }));

          try {
            const result = await PengelolaAuthService.verifyOtpLogin(
              phone,
              otp
            );
            const newUserState = result.data
              ? {
                  role: "pengelola" as const,
                  registrationStatus: result.data.registration_status,
                  tokenType: result.data.token_type || null,
                  nextStep: result.data.next_step || null,
                  sessionId: result.data.session_id,
                  isAuthenticated: true
                }
              : get().user;

            set((state) => ({
              ...state,
              loading: { ...state.loading, otpVerify: false },
              user: newUserState
            }));

            // ✅ FIX: Sync to cookies
            syncUserStateToCookies(newUserState);

            return result;
          } catch (error: any) {
            set((state) => ({
              ...state,
              loading: { ...state.loading, otpVerify: false },
              errors: { ...state.errors, otpVerify: error.message }
            }));
            throw error;
          }
        },

        verifyPin: async (pin) => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, pinVerify: true },
            errors: { ...state.errors, pinVerify: null }
          }));

          try {
            const result = await PengelolaAuthService.verifyPin(pin);
            const newUserState = result.data
              ? {
                  ...get().user,
                  registrationStatus: result.data.registration_status,
                  nextStep: result.data.next_step || null,
                  tokenType: result.data.token_type || null
                }
              : get().user;

            set((state) => ({
              ...state,
              loading: { ...state.loading, pinVerify: false },
              user: newUserState
            }));

            // ✅ FIX: Sync to cookies
            syncUserStateToCookies(newUserState);

            return result;
          } catch (error: any) {
            set((state) => ({
              ...state,
              loading: { ...state.loading, pinVerify: false },
              errors: { ...state.errors, pinVerify: error.message }
            }));
            throw error;
          }
        },

        // Common Actions
        logout: async () => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, logout: true },
            errors: { ...state.errors, logout: null }
          }));

          try {
            await CommonAuthService.logout();
            set({
              ...initialState,
              isInitialized: true
            });
          } catch (error: any) {
            set((state) => ({
              ...initialState,
              isInitialized: true,
              errors: { ...initialState.errors, logout: error.message }
            }));
          }
        },

        refreshToken: async () => {
          set((state) => ({
            ...state,
            loading: { ...state.loading, refreshToken: true }
          }));

          try {
            const result = await CommonAuthService.refreshToken();
            const newUserState = result.data
              ? {
                  ...get().user,
                  registrationStatus: result.data.registration_status,
                  tokenType: result.data.token_type || null,
                  nextStep: result.data.next_step || null,
                  sessionId: result.data.session_id || null
                }
              : get().user;

            set((state) => ({
              ...state,
              loading: { ...state.loading, refreshToken: false },
              user: newUserState
            }));

            // ✅ FIX: Sync to cookies
            syncUserStateToCookies(newUserState);

            return result;
          } catch (error: any) {
            set({
              ...initialState,
              isInitialized: true,
              loading: { ...initialState.loading, refreshToken: false }
            });
            throw error;
          }
        },

        // State Management
        clearErrors: (errorType) => {
          set((state) => ({
            ...state,
            errors: errorType
              ? { ...state.errors, [errorType]: null }
              : { ...initialState.errors }
          }));
        },

        setTempData: (data) => {
          set((state) => ({
            ...state,
            tempData: { ...state.tempData, ...data }
          }));
        },

        clearTempData: () => {
          set((state) => ({
            ...state,
            tempData: {
              phone: null,
              email: null,
              otp: null
            }
          }));
        },

        checkAuthStatus: () => {
          return get().user.isAuthenticated;
        },

        getNextStep: () => {
          return get().user.nextStep;
        },

        isRegistrationComplete: () => {
          return get().user.registrationStatus === "complete";
        }
      }),
      {
        name: "auth-storage",
        // ✅ FIXED: Persist user state AND tempData
        partialize: (state) => ({
          user: state.user,
          tempData: state.tempData,
          isInitialized: state.isInitialized
        })
      }
    ),
    {
      name: "auth-store"
    }
  )
);
