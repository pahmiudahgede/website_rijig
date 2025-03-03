import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
