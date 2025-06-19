'use client';

import { useEffect, useState } from 'react';
import { usePengelolaAuth } from '@/hooks/usePengelolaAuth';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

export default function PengelolaApprovalPage() {
  const { checkApprovalStatus } = usePengelolaAuth();
  const { user } = useAuth({
    requireAuth: true,
    requireRole: 'pengelola',
  });
  const { isLoading } = useAuthStore();
  
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    // Auto check every 30 seconds
    const interval = setInterval(() => {
      handleCheckStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckStatus = async () => {
    setCheckingStatus(true);
    const result = await checkApprovalStatus();
    setLastChecked(new Date());
    setCheckingStatus(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Menunggu Persetujuan
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            Data perusahaan Anda sedang dalam proses verifikasi oleh administrator.
          </p>
          
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-yellow-900">
              Proses Verifikasi
            </h3>
            <p className="mt-2 text-sm text-yellow-700">
              Proses verifikasi biasanya memakan waktu 1x24 jam. Anda akan menerima notifikasi
              setelah data perusahaan Anda disetujui.
            </p>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleCheckStatus}
              disabled={checkingStatus || isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingStatus ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memeriksa Status...
                </>
              ) : (
                'Periksa Status'
              )}
            </button>
          </div>
          
          {lastChecked && (
            <p className="mt-2 text-xs text-gray-500">
              Terakhir diperiksa: {lastChecked.toLocaleTimeString('id-ID')}
            </p>
          )}
          
          <div className="mt-8 text-sm text-gray-600">
            <p>Status akan otomatis diperiksa setiap 30 detik</p>
          </div>
        </div>
      </div>
    </div>
  );
}