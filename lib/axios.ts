import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
  withCredentials: true, // Menyertakan cookie dalam request
});

// Interceptor untuk request
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.meta?.message || 'Unknown error occurred';
    if (error?.response?.status === 401) {
      // Arahkan pengguna ke halaman login jika statusnya 401 (Unauthorized)
      window.location.href = '/login';
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
