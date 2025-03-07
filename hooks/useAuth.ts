"use client";

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export const useAuth = () => {
  const { userId, role, isAuthenticated, login, logout } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Redirect user jika tidak terautentikasi
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post('/logout'); // Menangani logout melalui API
      logout(); // Logout di store
      router.push('/login'); // Arahkan ke halaman login
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    userId,
    role,
    isAuthenticated,
    login,
    logout: handleLogout,
    loading,
  };
};
