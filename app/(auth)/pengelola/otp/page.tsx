'use client';

import { useState, useRef, useEffect } from 'react';
import { usePengelolaAuth } from '@/hooks/usePengelolaAuth';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function PengelolaOTPPage() {
  const { verifyOTP, otpPhone } = usePengelolaAuth();
  const { isLoading, error } = useAuthStore();
  const router = useRouter();
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    // Redirect if no phone number
    if (!otpPhone) {
      router.push('/pengelola/register');
    }
  }, [otpPhone, router]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus to next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      return;
    }
    
    await verifyOTP(otpString);
  };

  const handleResendOTP = () => {
    // TODO: Implement resend OTP
    alert('Fitur kirim ulang OTP akan segera tersedia');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verifikasi OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masukkan kode OTP yang telah dikirim ke WhatsApp
          </p>
          {otpPhone && (
            <p className="mt-1 text-center text-sm font-medium text-gray-900">
              {otpPhone}
            </p>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 text-center mb-4">
              Kode OTP (4 digit)
            </label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-md focus:border-green-500 focus:outline-none"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 4}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : 'Verifikasi'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              className="font-medium text-green-600 hover:text-green-500"
            >
              Kirim ulang OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}