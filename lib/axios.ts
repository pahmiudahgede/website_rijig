import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig
} from "axios";
import { ApiError } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY
  }
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const authStore = JSON.parse(
        localStorage.getItem("auth-storage") || "{}"
      );
      const user = authStore.state?.user;

      if (user?.access_token && config.headers) {
        config.headers.Authorization = `Bearer ${user.access_token}`;
      }
    }

    if (config.baseURL?.includes("ngrok")) {
      config.headers["ngrok-skip-browser-warning"] = "true";
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { useAuthStore } = await import("@/store/authStore");
        const { user, refreshToken } = useAuthStore.getState();

        if (user?.refresh_token) {
          await refreshToken();
          processQueue(null);
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { useAuthStore } = await import("@/store/authStore");
        useAuthStore.getState().logout();
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const axiosFormData: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-API-Key": API_KEY
  }
});

axiosFormData.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const authStore = JSON.parse(
        localStorage.getItem("auth-storage") || "{}"
      );
      const user = authStore.state?.user;

      if (user?.access_token && config.headers) {
        config.headers.Authorization = `Bearer ${user.access_token}`;
      }
    }

    if (config.baseURL?.includes("ngrok")) {
      config.headers["ngrok-skip-browser-warning"] = "true";
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosFormData.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosFormData(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { useAuthStore } = await import("@/store/authStore");
        const { user, refreshToken } = useAuthStore.getState();

        if (user?.refresh_token) {
          await refreshToken();
          processQueue(null);
          return axiosFormData(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { useAuthStore } = await import("@/store/authStore");
        useAuthStore.getState().logout();
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
