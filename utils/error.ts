import { AxiosError } from 'axios';
import { ApiError } from '@/types/api.types';

export interface ParsedError {
  message: string;
  fieldErrors?: Record<string, string[]>;
  statusCode?: number;
}

export const parseApiError = (error: unknown): ParsedError => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    
    return {
      message: apiError?.meta?.message || getDefaultErrorMessage(error.response?.status),
      fieldErrors: apiError?.errors,
      statusCode: error.response?.status
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message
    };
  }
  
  return {
    message: 'Terjadi kesalahan yang tidak diketahui'
  };
};

export const getDefaultErrorMessage = (statusCode?: number): string => {
  switch (statusCode) {
    case 400:
      return 'Data yang dikirim tidak valid';
    case 401:
      return 'Sesi Anda telah berakhir, silakan login kembali';
    case 403:
      return 'Anda tidak memiliki akses ke halaman ini';
    case 404:
      return 'Data yang dicari tidak ditemukan';
    case 409:
      return 'Data sudah ada atau konflik dengan data lain';
    case 422:
      return 'Data yang dikirim tidak dapat diproses';
    case 429:
      return 'Terlalu banyak permintaan, silakan coba lagi nanti';
    case 500:
      return 'Terjadi kesalahan pada server';
    case 502:
    case 503:
    case 504:
      return 'Server sedang tidak tersedia, silakan coba lagi nanti';
    default:
      return 'Terjadi kesalahan, silakan coba lagi';
  }
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && error.code === 'ERR_NETWORK';
  }
  return false;
};

export const isTimeoutError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.code === 'ECONNABORTED' || error.message.includes('timeout');
  }
  return false;
};

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};

// Format field errors for display
export const formatFieldErrors = (errors: Record<string, string[]>): Record<string, string> => {
  const formatted: Record<string, string> = {};
  
  Object.entries(errors).forEach(([field, messages]) => {
    formatted[field] = messages.join(', ');
  });
  
  return formatted;
};