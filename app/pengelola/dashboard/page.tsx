// 'use client';

// import { useAuth } from '@/hooks/useAuth';
// import { useAuthStore } from '@/store/authStore';

// export default function PengelolaDashboardPage() {
//   const { user, isReady } = useAuth({
//     requireAuth: true,
//     requireRole: 'pengelola',
//     requireFullToken: true,
//   });
  
//   const { logout } = useAuthStore();

//   if (!isReady || !user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <h1 className="text-xl font-semibold">Pengelola Dashboard</h1>
//             </div>
//             <div className="flex items-center">
//               <button
//                 onClick={logout}
//                 className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>
      
//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">
//                 Selamat datang, Pengelola!
//               </h2>
              
//               <div className="mt-4 space-y-2">
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Session ID:</span> {user.session_id}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Registration Status:</span> {user.registration_status}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Token Type:</span> {user.token_type}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">Device ID:</span> {user.device_id}
//                 </p>
//               </div>
              
//               <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
//                 <div className="bg-green-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Total Transaksi
//                   </dt>
//                   <dd className="mt-1 text-3xl font-semibold text-gray-900">
//                     0
//                   </dd>
//                 </div>
                
//                 <div className="bg-green-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Transaksi Hari Ini
//                   </dt>
//                   <dd className="mt-1 text-3xl font-semibold text-gray-900">
//                     0
//                   </dd>
//                 </div>
                
//                 <div className="bg-green-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Total Produk
//                   </dt>
//                   <dd className="mt-1 text-3xl font-semibold text-gray-900">
//                     0
//                   </dd>
//                 </div>
                
//                 <div className="bg-green-50 overflow-hidden rounded-lg px-4 py-5 sm:p-6">
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Status
//                   </dt>
//                   <dd className="mt-1 text-lg font-semibold text-green-600">
//                     Aktif
//                   </dd>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">
//                 Menu Cepat
//               </h3>
//               <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//                 <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
//                   <div className="text-2xl mb-2">📦</div>
//                   <div className="text-sm font-medium">Produk</div>
//                 </button>
//                 <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
//                   <div className="text-2xl mb-2">💰</div>
//                   <div className="text-sm font-medium">Transaksi</div>
//                 </button>
//                 <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
//                   <div className="text-2xl mb-2">📊</div>
//                   <div className="text-sm font-medium">Laporan</div>
//                 </button>
//                 <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
//                   <div className="text-2xl mb-2">⚙️</div>
//                   <div className="text-sm font-medium">Pengaturan</div>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


'use client';

import { useAuth, useProtectedRoute } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  BarChart3, 
  LogOut,
  Settings,
  Bell,
  Plus,
  Package,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function PengelolaDashboardPage() {
  // Protect route - require pengelola authentication
  useProtectedRoute('pengelola');
  
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const quickStats = [
    { label: 'Active Collections', value: '12', icon: Truck, color: 'text-blue-600' },
    { label: 'Total Waste (kg)', value: '2,450', icon: Package, color: 'text-green-600' },
    { label: 'Pending Requests', value: '5', icon: Clock, color: 'text-orange-600' },
    { label: 'Completed Today', value: '8', icon: CheckCircle, color: 'text-purple-600' },
  ];

  const recentCollections = [
    { id: 1, location: 'Jl. Sudirman No. 45', type: 'Organic', amount: '25 kg', status: 'Completed', time: '2 hours ago' },
    { id: 2, location: 'Komplek Green Valley', type: 'Plastic', amount: '15 kg', status: 'In Progress', time: '4 hours ago' },
    { id: 3, location: 'Mall Central Park', type: 'Mixed', amount: '120 kg', status: 'Scheduled', time: '1 day ago' },
  ];

  const upcomingSchedule = [
    { id: 1, location: 'Jl. Thamrin No. 12', time: '09:00', type: 'Organic', amount: '30 kg' },
    { id: 2, location: 'Perumahan Bintaro', time: '11:30', type: 'Plastic', amount: '45 kg' },
    { id: 3, location: 'Kantor Pemerintah', time: '14:00', type: 'Paper', amount: '60 kg' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Pengelola Dashboard</h1>
              <p className="text-sm text-gray-500">Waste Collection Management</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {user.role}
              </Badge>
              
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-600">
              Manage your waste collection operations efficiently.
            </p>
          </div>
          
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Today's Schedule
                <Badge variant="secondary">{upcomingSchedule.length}</Badge>
              </CardTitle>
              <CardDescription>
                Upcoming waste collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSchedule.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-8 bg-blue-500 rounded"></div>
                      <div>
                        <p className="font-medium text-sm">{item.location}</p>
                        <p className="text-xs text-gray-500">{item.type} • {item.amount}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{item.time}</p>
                      <Button size="sm" variant="outline" className="text-xs mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        Navigate
                      </Button>
                    </div>
                  </div>
                ))}
                
                {upcomingSchedule.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No collections scheduled for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Collections */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Collections</CardTitle>
              <CardDescription>
                Latest waste collection activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCollections.map((collection) => (
                  <div key={collection.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{collection.location}</p>
                      <p className="text-xs text-gray-500">{collection.type} • {collection.amount} • {collection.time}</p>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(collection.status)}>
                      {collection.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common collection management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-xs">Add Collection</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col">
                <MapPin className="w-6 h-6 mb-2" />
                <span className="text-xs">View Routes</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col">
                <BarChart3 className="w-6 h-6 mb-2" />
                <span className="text-xs">Reports</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col">
                <Truck className="w-6 h-6 mb-2" />
                <span className="text-xs">Fleet Status</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>This Week's Performance</CardTitle>
            <CardDescription>
              Your collection performance overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">95%</p>
                <p className="text-sm text-gray-600">On-time Collection</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">1,240kg</p>
                <p className="text-sm text-gray-600">Total Waste Collected</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">42</p>
                <p className="text-sm text-gray-600">Collections Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}