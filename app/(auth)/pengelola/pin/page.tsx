'use client';

import { useState, useRef, useEffect } from 'react';
import { usePengelolaAuth } from '@/hooks/usePengelolaAuth';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { validatePIN } from '@/utils/validation';

export default function PengelolaPINPage() {
  const { createPIN, verifyPIN } = usePengelolaAuth();
  const { isLoading, error } = useAuthStore();
  const { user } = useAuth({
    requireAuth: true,
    requireRole: 'pengelola',
  });
  
  const [isCreating, setIsCreating] = useState(true);
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [validationError, setValidationError] = useState('');
  
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  
  const confirmPinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    // Determine if creating or verifying based on user status and next_step
    if (user) {
      const needsToCreate = user.registration_status === 'approved' || 
                           (user.registration_status === 'complete' && user.token_type === 'partial');
      setIsCreating(needsToCreate);
    }
  }, [user]);

  const handlePinChange = (index: number, value: string, isConfirm = false) => {
    if (value.length > 1) return;
    
    const refs = isConfirm ? confirmPinRefs : pinRefs;
    const currentPin = isConfirm ? [...confirmPin] : [...pin];
    currentPin[index] = value;
    
    if (isConfirm) {
      setConfirmPin(currentPin);
    } else {
      setPin(currentPin);
    }
    
    // Auto focus to next input
    if (value && index < 5) {
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent, isConfirm = false) => {
    const refs = isConfirm ? confirmPinRefs : pinRefs;
    const currentPin = isConfirm ? confirmPin : pin;
    
    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    const pinString = pin.join('');
    
    if (!validatePIN(pinString)) {
      setValidationError('PIN harus 6 digit angka');
      return;
    }
    
    if (isCreating) {
      const confirmPinString = confirmPin.join('');
      if (pinString !== confirmPinString) {
        setValidationError('PIN tidak sama');
        return;
      }
      
      await createPIN(pinString);
    } else {
      await verifyPIN(pinString);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isCreating ? 'Buat PIN' : 'Verifikasi PIN'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isCreating 
              ? 'Buat PIN 6 digit untuk keamanan akun Anda' 
              : 'Masukkan PIN 6 digit Anda untuk melanjutkan'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          {validationError && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{validationError}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 text-center mb-4">
              {isCreating ? 'PIN Baru' : 'PIN'}
            </label>
            <div className="flex justify-center space-x-2">
              {pin.map((digit, index) => (
                <input
                  key={`pin-${index}`}
                  ref={pinRefs[index]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-md focus:border-green-500 focus:outline-none"
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
          </div>
          
          {isCreating && (
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                Konfirmasi PIN
              </label>
              <div className="flex justify-center space-x-2">
                {confirmPin.map((digit, index) => (
                  <input
                    key={`confirm-${index}`}
                    ref={confirmPinRefs[index]}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-md focus:border-green-500 focus:outline-none"
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value, true)}
                    onKeyDown={(e) => handleKeyDown(index, e, true)}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || pin.join('').length !== 6}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : (isCreating ? 'Buat PIN' : 'Verifikasi')}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>PIN ini akan digunakan untuk login di masa mendatang</p>
          </div>
        </form>
      </div>
    </div>
  );
}