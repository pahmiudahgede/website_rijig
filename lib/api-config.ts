import axios from 'axios';

// Create axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.NEXT_PUBLIC_API_KEY,
    'ngrok-skip-browser-warning': 'true',
  },
  // timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers['ngrok-skip-browser-warning'] = 'true';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`,
            { refresh_token: refreshToken },
            {
              headers: {
                'X-API-Key': process.env.NEXT_PUBLIC_API_KEY,
                'ngrok-skip-browser-warning': 'true',
              },
            }
          );
          
          const newToken = response.data.data.access_token;
          localStorage.setItem('access_token', newToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          originalRequest.headers['ngrok-skip-browser-warning'] = 'true';
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Create FormData instance untuk upload file
export const apiClientForm = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    'X-API-Key': process.env.NEXT_PUBLIC_API_KEY,
    'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
  },
  timeout: 30000, // 30 seconds untuk upload
});

// Add same request interceptor to form client
apiClientForm.interceptors.request.use(
  (config) => {
    // Get token from localStorage or zustand store
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Always include ngrok skip header
    config.headers['ngrok-skip-browser-warning'] = 'true';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add same response interceptor to form client
apiClientForm.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`,
            { refresh_token: refreshToken },
            {
              headers: {
                'X-API-Key': process.env.NEXT_PUBLIC_API_KEY,
                'ngrok-skip-browser-warning': 'true',
              },
            }
          );
          
          const newToken = response.data.data.access_token;
          localStorage.setItem('access_token', newToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          originalRequest.headers['ngrok-skip-browser-warning'] = 'true';
          return apiClientForm(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);