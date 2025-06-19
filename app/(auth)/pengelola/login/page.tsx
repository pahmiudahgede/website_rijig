'use client';

import { useState } from 'react';
import { usePengelolaAuth } from '@/hooks/usePengelolaAuth';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { validatePhone } from '@/utils/validation';

export default function PengelolaLoginPage() {
  const { requestOTP } = usePengelolaAuth();
  const { isLoading, error } = useAuthStore();
  
  const [phone, setPhone] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationError('');
    
    // Format phone number
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('62')) {
      formattedPhone = '62' + formattedPhone;
    }
    
    // Validate
    if (!validatePhone(formattedPhone)) {
      setValidationError('Nomor telepon tidak valid. Format: 08xx atau 62xxx (8-14 digit)');
      return;
    }
    
    // Request OTP for login
    await requestOTP(formattedPhone, true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login Pengelola
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masukkan nomor telepon terdaftar untuk login
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="081234567890"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {validationError && (
              <p className="mt-1 text-sm text-red-600">{validationError}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Kode OTP akan dikirim melalui WhatsApp
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Kirim OTP'}
            </button>
          </div>
          
          <div className="text-center">
            <Link
              href="/pengelola/register"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Belum punya akun? Daftar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}