import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { pengelolaAuthService } from "@/services";
import { useAuthStore } from "@/store/authStore";
import { CompanyProfileData, PINData, NextStep } from "@/types/auth.types";
import { getOrCreateDeviceId } from "@/utils/device";
import { formatPhoneNumber } from "@/utils/validation";
import { AxiosError } from "axios";
import { ApiError } from "@/types/api.types";

export const usePengelolaAuth = () => {
  const router = useRouter();
  const { user, setUser, setLoading, setError, clearError } = useAuthStore();
  const [otpPhone, setOtpPhone] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError;
        setError(apiError?.meta?.message || "Terjadi kesalahan");
      } else {
        setError("Terjadi kesalahan yang tidak diketahui");
      }
    },
    [setError]
  );

  const requestOTP = useCallback(
    async (phone: string, isLoginFlow: boolean = false) => {
      try {
        setLoading(true);
        clearError();

        const formattedPhone = formatPhoneNumber(phone);
        setOtpPhone(formattedPhone);
        setIsLogin(isLoginFlow);

        const service = isLoginFlow
          ? pengelolaAuthService.requestOTPLogin
          : pengelolaAuthService.requestOTPRegister;

        const response = await service({
          role_name: "pengelola",
          phone: formattedPhone
        });

        if (response.data?.meta?.status === 200) {
          router.push("/pengelola/otp");
          return { success: true };
        }

        return { success: false };
      } catch (error) {
        handleError(error);
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [router, setLoading, clearError, handleError]
  );

  const verifyOTP = useCallback(
    async (otp: string) => {
      try {
        setLoading(true);
        clearError();

        const service = isLogin
          ? pengelolaAuthService.verifyOTPLogin
          : pengelolaAuthService.verifyOTPRegister;

        const response = await service({
          role_name: "pengelola",
          phone: otpPhone,
          otp,
          device_id: getOrCreateDeviceId()
        });

        if (response.data?.meta?.status === 200 && response.data?.data) {
          const authData = response.data.data;

          setUser({
            role: "pengelola",
            access_token: authData.access_token,
            refresh_token: authData.refresh_token,
            session_id: authData.session_id,
            registration_status: authData.registration_status,
            token_type: authData.token_type,
            device_id: getOrCreateDeviceId()
          });

          navigateToNextStep(authData.next_step);
          return { success: true };
        }

        return { success: false };
      } catch (error) {
        handleError(error);
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [router, otpPhone, isLogin, setLoading, clearError, setUser, handleError]
  );

  const createCompanyProfile = useCallback(
    async (data: CompanyProfileData) => {
      try {
        setLoading(true);
        clearError();

        const response = await pengelolaAuthService.createCompanyProfile(data);

        if (response.data?.meta?.status === 200 && response.data?.data) {
          const responseData = response.data.data;

          setUser({
            ...user!,
            access_token: responseData.access_token,
            refresh_token: responseData.refresh_token,
            registration_status: responseData.registration_status,
            token_type: responseData.token_type
          });

          router.push("/pengelola/approval");
          return { success: true };
        }

        return { success: false };
      } catch (error) {
        handleError(error);
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [router, user, setUser, setLoading, clearError, handleError]
  );

  const checkApprovalStatus = useCallback(async () => {
    try {
      setLoading(true);

      const response = await pengelolaAuthService.checkApprovalStatus();

      if (response.data?.meta?.status === 200 && response.data?.data) {
        const statusData = response.data.data;

        if (
          statusData.registration_status === "approved" &&
          statusData.access_token
        ) {
          setUser({
            ...user!,
            access_token: statusData.access_token,
            refresh_token: statusData.refresh_token!,
            registration_status: statusData.registration_status as any
          });

          router.push("/pengelola/pin");
          return { approved: true };
        }

        return { approved: false, status: statusData.registration_status };
      }

      return { approved: false };
    } catch (error) {
      handleError(error);
      return { approved: false };
    } finally {
      setLoading(false);
    }
  }, [router, user, setUser, setLoading, handleError]);

  const createPIN = useCallback(
    async (pin: string) => {
      try {
        setLoading(true);
        clearError();

        const response = await pengelolaAuthService.createPIN({ userpin: pin });

        if (response.data?.meta?.status === 200 && response.data?.data) {
          const authData = response.data.data;

          setUser({
            ...user!,
            access_token: authData.access_token,
            refresh_token: authData.refresh_token,
            registration_status: authData.registration_status,
            token_type: authData.token_type
          });

          router.push("/pengelola/dashboard");
          return { success: true };
        }

        return { success: false };
      } catch (error) {
        handleError(error);
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [router, user, setUser, setLoading, clearError, handleError]
  );

  const verifyPIN = useCallback(
    async (pin: string) => {
      try {
        setLoading(true);
        clearError();

        const response = await pengelolaAuthService.verifyPIN({ userpin: pin });

        if (response.data?.meta?.status === 200 && response.data?.data) {
          const authData = response.data.data;

          setUser({
            ...user!,
            access_token: authData.access_token,
            refresh_token: authData.refresh_token,
            registration_status: authData.registration_status,
            token_type: authData.token_type
          });

          router.push("/pengelola/dashboard");
          return { success: true };
        }

        return { success: false };
      } catch (error) {
        handleError(error);
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [router, user, setUser, setLoading, clearError, handleError]
  );

  const navigateToNextStep = (nextStep?: NextStep) => {
    switch (nextStep) {
      case "complete_company_data":
        router.push("/pengelola/company");
        break;
      case "awaiting_admin_approval":
      case "wait_for_approval":
        router.push("/pengelola/approval");
        break;
      case "create_pin":
        router.push("/pengelola/pin");
        break;
      case "verif_pin":
        router.push("/pengelola/pin");
        break;
      case "completed":
        router.push("/pengelola/dashboard");
        break;
      default:
        router.push("/pengelola/register");
    }
  };

  return {
    requestOTP,
    verifyOTP,
    createCompanyProfile,
    checkApprovalStatus,
    createPIN,
    verifyPIN,
    otpPhone
  };
};
