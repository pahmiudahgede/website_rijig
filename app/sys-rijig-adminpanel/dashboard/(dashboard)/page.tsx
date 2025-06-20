"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Truck,
  Recycle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  DollarSign,
  Activity
} from "lucide-react";

interface DashboardStats {
  totalUsers: {
    pengepul: number;
    masyarakat: number;
    pengelolaDaurUlang: number;
  };
  pendingApprovals: number;
  totalTransaksi: {
    harian: number;
    bulanan: number;
    total: number;
  };
  volumeSampah: {
    terkumpul: number; // dalam kg
    diproses: number; // dalam kg
    pending: number; // dalam kg
  };
  revenue: {
    harian: number;
    bulanan: number;
    growth: number; // persentase
  };
  recentActivities: Array<{
    id: string;
    type: 'registration' | 'transaction' | 'processing';
    user: string;
    action: string;
    timestamp: string;
  }>;
}

export default function AdminDashboardPage() {
  const { user, isReady } = useAuth({
    requireAuth: true,
    requireRole: "administrator"
  });

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && user) {
      fetchDashboardData();
    }
  }, [isReady, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set data dummy untuk development
      setStats({
        totalUsers: {
          pengepul: 47,
          masyarakat: 1234,
          pengelolaDaurUlang: 23
        },
        pendingApprovals: 8,
        totalTransaksi: {
          harian: 25,
          bulanan: 456,
          total: 2847
        },
        volumeSampah: {
          terkumpul: 12450, // kg
          diproses: 8930, // kg
          pending: 3520 // kg
        },
        revenue: {
          harian: 2500000,
          bulanan: 45670000,
          growth: 12.5
        },
        recentActivities: [
          {
            id: '1',
            type: 'registration',
            user: 'CV Maju Jaya',
            action: 'Mendaftar sebagai pengepul',
            timestamp: '2 jam yang lalu'
          },
          {
            id: '2',
            type: 'transaction',
            user: 'Ahmad Sudiro',
            action: 'Menjual 15kg sampah plastik',
            timestamp: '3 jam yang lalu'
          },
          {
            id: '3',
            type: 'processing',
            user: 'PT Daur Ulang Mandiri',
            action: 'Memproses 200kg sampah kertas',
            timestamp: '5 jam yang lalu'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isReady || !user) {
    return <DashboardSkeleton />;
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatWeight = (weight: number) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)} ton`;
    }
    return `${weight} kg`;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Dashboard Pengelolaan Sampah
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selamat datang, Administrator! Kelola sistem RIJIK dari sini.
          </p>
        </div>
        <nav className="text-sm text-gray-500 dark:text-gray-400">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 dark:text-white">Dashboard</span>
        </nav>
      </div>

      {/* Stats Grid - Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Pengepul */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengepul</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.totalUsers.pengepul || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Pengepul sampah terdaftar
            </p>
          </CardContent>
        </Card>

        {/* Total Masyarakat */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Masyarakat</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.totalUsers.masyarakat || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Masyarakat terdaftar
            </p>
          </CardContent>
        </Card>

        {/* Total Pengelola Daur Ulang */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengelola Daur Ulang</CardTitle>
            <Recycle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.totalUsers.pengelolaDaurUlang || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Fasilitas daur ulang
            </p>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Approval</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.pendingApprovals || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Perlu ditinjau
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Volume Sampah */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-600" />
              Volume Sampah
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Terkumpul</span>
              <span className="font-semibold text-green-600">
                {formatWeight(stats?.volumeSampah.terkumpul || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Diproses</span>
              <span className="font-semibold text-blue-600">
                {formatWeight(stats?.volumeSampah.diproses || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending</span>
              <span className="font-semibold text-orange-600">
                {formatWeight(stats?.volumeSampah.pending || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-600" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Hari ini</span>
              <span className="font-semibold">
                {formatCurrency(stats?.revenue.harian || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bulan ini</span>
              <span className="font-semibold">
                {formatCurrency(stats?.revenue.bulanan || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Growth</span>
              <div className="flex items-center gap-1">
                {(stats?.revenue.growth || 0) >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`font-semibold ${
                  (stats?.revenue.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats?.revenue.growth || 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaksi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-600" />
              Transaksi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Hari ini</span>
              <span className="font-semibold text-blue-600">
                {stats?.totalTransaksi.harian || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bulan ini</span>
              <span className="font-semibold text-green-600">
                {stats?.totalTransaksi.bulanan || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-semibold text-purple-600">
                {stats?.totalTransaksi.total || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Aktivitas terbaru dalam sistem RIJIK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="mt-1">
                    {activity.type === 'registration' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    {activity.type === 'transaction' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    {activity.type === 'processing' && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Kelola sistem dengan mudah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => window.location.href = '/sys-rijig-adminpanel/users/pending'}
              >
                <Clock className="mr-2 h-4 w-4" />
                Review Pendaftaran ({stats?.pendingApprovals || 0})
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => window.location.href = '/sys-rijig-adminpanel/transactions'}
              >
                <Activity className="mr-2 h-4 w-4" />
                Lihat Semua Transaksi
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => window.location.href = '/sys-rijig-adminpanel/reports'}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Laporan
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => window.location.href = '/sys-rijig-adminpanel/settings'}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Pengaturan Sistem
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Main Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Skeleton className="w-2 h-2 rounded-full mt-1" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-48 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}