"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, LoginRequest } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { LoginForm } from '@/components/login-form';
import { ROLES } from '@/constants/role';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { login } = useAuthStore();

  // Fungsi untuk menangani submit form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const loginData: LoginRequest = {
      roleid: ROLES.ADMIN, // Ganti sesuai dengan role yang dibutuhkan
      identifier,
      password,
    };

    try {
      // Menggunakan service untuk login
      const response = await loginUser(loginData);
      const { user_id, role_name, token } = response;

      // Menyimpan data autentikasi dan redirect ke dashboard
      login(user_id, role_name, token);
      router.push('/dashboard');
    } catch (error: any) {
      // Menangani error login dengan pesan yang lebih spesifik
      if (error.message === 'Account not found') {
        setErrorMessage('Akun tidak ditemukan.');
      } else if (error.message === 'Invalid password') {
        setErrorMessage('Password salah. Silakan coba lagi.');
      } else {
        setErrorMessage(error.message || 'Login gagal. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        {/* Komponen form login */}
        <LoginForm
          className="space-y-4"
          onSubmit={handleSubmit}
          identifier={identifier}
          setIdentifier={setIdentifier}
          password={password}
          setPassword={setPassword}
          loading={loading}
        />
        
        {/* Menampilkan pesan error jika ada */}
        {errorMessage && (
          <div className="bg-red-500 text-white p-2 rounded-md mt-4">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
