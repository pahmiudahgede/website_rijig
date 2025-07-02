"use client";

import { useMemo } from "react";
import { useAuth, useProtectedRoute } from "@/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface QuickStat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Collection {
  id: number;
  location: string;
  type: string;
  amount: string;
  status: "Completed" | "In Progress" | "Scheduled";
  time: string;
}

interface ScheduleItem {
  id: number;
  location: string;
  time: string;
  type: string;
  amount: string;
}

interface PerformanceMetric {
  value: string;
  label: string;
  color: string;
}

// Constants
const QUICK_STATS: QuickStat[] = [
  {
    label: "Active Collections",
    value: "12",
    icon: Truck,
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    label: "Total Waste (kg)",
    value: "2,450",
    icon: Package,
    color: "text-green-600 dark:text-green-400"
  },
  {
    label: "Pending Requests",
    value: "5",
    icon: Clock,
    color: "text-orange-600 dark:text-orange-400"
  },
  {
    label: "Completed Today",
    value: "8",
    icon: CheckCircle,
    color: "text-purple-600 dark:text-purple-400"
  }
];

const RECENT_COLLECTIONS: Collection[] = [
  {
    id: 1,
    location: "Jl. Sudirman No. 45",
    type: "Organic",
    amount: "25 kg",
    status: "Completed",
    time: "2 hours ago"
  },
  {
    id: 2,
    location: "Komplek Green Valley",
    type: "Plastic",
    amount: "15 kg",
    status: "In Progress",
    time: "4 hours ago"
  },
  {
    id: 3,
    location: "Mall Central Park",
    type: "Mixed",
    amount: "120 kg",
    status: "Scheduled",
    time: "1 day ago"
  }
];

const UPCOMING_SCHEDULE: ScheduleItem[] = [
  {
    id: 1,
    location: "Jl. Thamrin No. 12",
    time: "09:00",
    type: "Organic",
    amount: "30 kg"
  },
  {
    id: 2,
    location: "Perumahan Bintaro",
    time: "11:30",
    type: "Plastic",
    amount: "45 kg"
  },
  {
    id: 3,
    location: "Kantor Pemerintah",
    time: "14:00",
    type: "Paper",
    amount: "60 kg"
  }
];

const PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    value: "95%",
    label: "On-time Collection",
    color: "text-green-600 dark:text-green-400"
  },
  {
    value: "1,240kg",
    label: "Total Waste Collected",
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    value: "42",
    label: "Collections Completed",
    color: "text-purple-600 dark:text-purple-400"
  }
];

const QUICK_ACTIONS = [
  { icon: Plus, label: "Add Collection" },
  { icon: MapPin, label: "View Routes" },
  { icon: BarChart3, label: "Reports" },
  { icon: Truck, label: "Fleet Status" }
];

// Utility Functions
const getStatusBadgeStyle = (status: Collection["status"]): string => {
  const baseStyles = "transition-colors duration-200";

  switch (status) {
    case "Completed":
      return cn(
        baseStyles,
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      );
    case "In Progress":
      return cn(
        baseStyles,
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      );
    case "Scheduled":
      return cn(
        baseStyles,
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      );
    default:
      return cn(
        baseStyles,
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      );
  }
};

// Components
interface StatCardProps {
  stat: QuickStat;
}

function StatCard({ stat }: StatCardProps) {
  const IconComponent = stat.icon;

  return (
    <Card className="transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-800/25">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stat.value}
            </p>
          </div>
          <IconComponent className={cn("w-8 h-8", stat.color)} />
        </div>
      </CardContent>
    </Card>
  );
}

interface ScheduleCardProps {
  schedule: ScheduleItem[];
}

function ScheduleCard({ schedule }: ScheduleCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-800/25">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-gray-900 dark:text-gray-100">
          Today's Schedule
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          >
            {schedule.length}
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Upcoming waste collections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-8 bg-blue-500 dark:bg-blue-400 rounded" />
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {item.location}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.type} • {item.amount}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {item.time}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs mt-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  Navigate
                </Button>
              </div>
            </div>
          ))}

          {schedule.length === 0 && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
              <p className="text-sm">No collections scheduled for today</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface RecentCollectionsCardProps {
  collections: Collection[];
}

function RecentCollectionsCard({ collections }: RecentCollectionsCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-800/25">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Recent Collections
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Latest waste collection activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {collection.location}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {collection.type} • {collection.amount} • {collection.time}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={getStatusBadgeStyle(collection.status)}
              >
                {collection.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickActionsCardProps {
  actions: typeof QUICK_ACTIONS;
}

function QuickActionsCard({ actions }: QuickActionsCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-800/25">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          Quick Actions
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Common collection management tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex-col transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
              >
                <IconComponent className="w-6 h-6 mb-2" />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface PerformanceCardProps {
  metrics: PerformanceMetric[];
}

function PerformanceCard({ metrics }: PerformanceCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-800/25">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100">
          This Week's Performance
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Your collection performance overview
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6 text-center">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="transition-transform duration-200 hover:scale-105"
            >
              <p className={cn("text-2xl font-bold", metric.color)}>
                {metric.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main Component
export default function PengelolaDashboardPage() {
  const memoizedStats = useMemo(() => QUICK_STATS, []);
  const memoizedCollections = useMemo(() => RECENT_COLLECTIONS, []);
  const memoizedSchedule = useMemo(() => UPCOMING_SCHEDULE, []);
  const memoizedMetrics = useMemo(() => PERFORMANCE_METRICS, []);
  const memoizedActions = useMemo(() => QUICK_ACTIONS, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your waste collection operations efficiently.
            </p>
          </div>

          <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-colors duration-200">
            <Plus className="w-4 h-4 mr-2" />
            New Collection
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {memoizedStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Today's Schedule */}
          <ScheduleCard schedule={memoizedSchedule} />

          {/* Recent Collections */}
          <RecentCollectionsCard collections={memoizedCollections} />
        </div>

        {/* Quick Actions */}
        <QuickActionsCard actions={memoizedActions} />

        {/* Performance Summary */}
        <div className="mt-8">
          <PerformanceCard metrics={memoizedMetrics} />
        </div>
      </main>
    </div>
  );
}
