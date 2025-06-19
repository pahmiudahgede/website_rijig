'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';

export default function PengelolaDashboardPage() {
  const { user, isReady } = useAuth({
    requireAuth: true,
    requireRole: 'pengelola',
    requireFullToken: true,
  });
  
  const { logout } = useAuthStore();

  if (!isReady || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Pengelola Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Selamat datang, Pengelola!
              </h2>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Session ID:</span> {user.session_id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Registration Status:</span> {user.registration_status}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Token Type:</span> {user.token_type}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Device ID:</span> {user.device_id}
                </p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-green-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Transaksi
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    0
                  </dd>
                </div>
                
                <div className="bg-green-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Transaksi Hari Ini
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    0
                  </dd>
                </div>
                
                <div className="bg-green-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Produk
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    0
                  </dd>
                </div>
                
                <div className="bg-green-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Status
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-green-600">
                    Aktif
                  </dd>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Menu Cepat
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">📦</div>
                  <div className="text-sm font-medium">Produk</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <div className="text-sm font-medium">Transaksi</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm font-medium">Laporan</div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="text-sm font-medium">Pengaturan</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}