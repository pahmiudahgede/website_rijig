// components/admin/sidebar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Recycle,
  Users,
  TrendingUp,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  MessageCircle,
  MapPin,
  Package,
  DollarSign,
  UserCheck,
  Building2,
  Newspaper,
  HelpCircle,
  Bell,
  Shield,
  ChevronDown,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  isHovered: boolean;
  isMobile: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface MenuItem {
  title: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string;
  badgeVariant?: "pro" | "new" | "urgent";
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    children: [
      {
        title: "Overview",
        href: "/sys-rijig-adminpanel/dashboard"
      },
      { title: "Analytics", href: "/admin/analytics" },
      { title: "Statistik Sampah", href: "/admin/waste-stats", badge: "new" },
      { title: "Laporan Harian", href: "/admin/daily-reports" }
    ]
  },
  {
    title: "Data Sampah",
    icon: <Recycle className="w-5 h-5" />,
    children: [
      { title: "Jenis Sampah", href: "/sys-rijig-adminpanel/dashboard/waste" },
      { title: "Harga Sampah", href: "/admin/waste-prices" },
      { title: "Volume Sampah", href: "/admin/waste-volume" },
      { title: "Tracking Sampah", href: "/admin/waste-tracking", badge: "new" },
      { title: "Kualitas Sampah", href: "/admin/waste-quality" }
    ]
  },
  {
    title: "Manajemen User",
    icon: <Users className="w-5 h-5" />,
    children: [
      { title: "Masyarakat", href: "/admin/users/community" },
      { title: "Pengepul", href: "/admin/users/collectors" },
      { title: "Pengelola Daur Ulang", href: "/admin/users/recyclers" },
      {
        title: "Verifikasi User",
        href: "/admin/users/verification",
        badge: "urgent"
      },
      { title: "Rating & Review", href: "/admin/users/reviews" }
    ]
  },
  {
    title: "Transaksi",
    icon: <CreditCard className="w-5 h-5" />,
    children: [
      { title: "Semua Transaksi", href: "/admin/transactions/all" },
      {
        title: "Pembayaran Pending",
        href: "/admin/transactions/pending",
        badge: "urgent"
      },
      { title: "Riwayat Pembayaran", href: "/admin/transactions/history" },
      { title: "Komisi & Fee", href: "/admin/transactions/commission" },
      {
        title: "Laporan Keuangan",
        href: "/admin/transactions/financial-report"
      }
    ]
  }
];

const contentMenuItems: MenuItem[] = [
  {
    title: "Content Management",
    icon: <FileText className="w-5 h-5" />,
    children: [
      { title: "Artikel & Blog", href: "/admin/content/articles" },
      { title: "Tips & Panduan", href: "/admin/content/guides" },
      { title: "FAQ", href: "/admin/content/faq" },
      {
        title: "Pengumuman",
        href: "/admin/content/announcements",
        badge: "new"
      },
      { title: "Testimoni", href: "/admin/content/testimonials" }
    ]
  },
  {
    title: "Lokasi & Mapping",
    icon: <MapPin className="w-5 h-5" />,
    children: [
      { title: "Peta Pengepul", href: "/admin/mapping/collectors" },
      { title: "Area Coverage", href: "/admin/mapping/coverage" },
      { title: "Titik Pengumpulan", href: "/admin/mapping/collection-points" },
      { title: "Rute Optimal", href: "/admin/mapping/routes", badge: "new" }
    ]
  },
  {
    title: "Notifikasi",
    icon: <Bell className="w-5 h-5" />,
    children: [
      { title: "Push Notifications", href: "/admin/notifications/push" },
      { title: "Email Broadcast", href: "/admin/notifications/email" },
      { title: "SMS Gateway", href: "/admin/notifications/sms" },
      { title: "Template Pesan", href: "/admin/notifications/templates" }
    ]
  }
];

const analyticsMenuItems: MenuItem[] = [
  {
    title: "Reports & Analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    children: [
      { title: "Laporan Bulanan", href: "/admin/reports/monthly" },
      {
        title: "Performa Pengepul",
        href: "/admin/reports/collector-performance"
      },
      { title: "Tren Harga", href: "/admin/reports/price-trends" },
      {
        title: "Dampak Lingkungan",
        href: "/admin/reports/environmental-impact",
        badge: "new"
      },
      { title: "ROI Analysis", href: "/admin/reports/roi-analysis" }
    ]
  },
  {
    title: "Partner & Kerjasama",
    icon: <Building2 className="w-5 h-5" />,
    children: [
      { title: "Bank Sampah", href: "/admin/partners/waste-banks" },
      {
        title: "Industri Daur Ulang",
        href: "/admin/partners/recycling-industry"
      },
      { title: "Pemerintah Daerah", href: "/admin/partners/government" },
      { title: "NGO & Komunitas", href: "/admin/partners/ngo-community" }
    ]
  },
  {
    title: "Support & Help",
    icon: <HelpCircle className="w-5 h-5" />,
    children: [
      {
        title: "Tiket Support",
        href: "/admin/support/tickets",
        badge: "urgent"
      },
      { title: "Live Chat", href: "/admin/support/chat" },
      { title: "Knowledge Base", href: "/admin/support/knowledge-base" },
      { title: "Training Materials", href: "/admin/support/training" }
    ]
  },
  {
    title: "Pengaturan",
    icon: <Settings className="w-5 h-5" />,
    children: [
      { title: "Konfigurasi Sistem", href: "/admin/settings/system" },
      { title: "Pengaturan Harga", href: "/admin/settings/pricing" },
      {
        title: "Role & Permission",
        href: "/admin/settings/roles",
        badge: "pro"
      },
      { title: "Backup & Restore", href: "/admin/settings/backup" },
      { title: "API Management", href: "/admin/settings/api", badge: "pro" }
    ]
  }
];

function MenuSection({
  title,
  items,
  isCollapsed,
  isHovered
}: {
  title: string;
  items: MenuItem[];
  isCollapsed: boolean;
  isHovered: boolean;
}) {
  const showText = !isCollapsed || isHovered;

  return (
    <div className="space-y-2">
      {showText && (
        <h3 className="mb-4 px-3 text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold tracking-wider">
          {title}
        </h3>
      )}
      <ul className="space-y-1">
        {items.map((item, index) => (
          <MenuItemComponent
            key={index}
            item={item}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
        ))}
      </ul>
    </div>
  );
}

function MenuItemComponent({
  item,
  isCollapsed,
  isHovered
}: {
  item: MenuItem;
  isCollapsed: boolean;
  isHovered: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const showText = !isCollapsed || isHovered;

  // For collapsed state without hover, show tooltip
  if (isCollapsed && !isHovered) {
    return (
      <li>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-full h-12 p-0 justify-center text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                asChild={!hasChildren}
              >
                {hasChildren ? (
                  <div>{item.icon}</div>
                ) : (
                  <Link href={item.href || "#"}>{item.icon}</Link>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </li>
    );
  }

  if (hasChildren) {
    return (
      <li>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between px-3 py-2.5 h-auto text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {showText && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </div>
              {showText && (
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </Button>
          </CollapsibleTrigger>
          {showText && (
            <CollapsibleContent className="ml-8 mt-1 space-y-1">
              {item.children?.map((child, childIndex) => (
                <Link
                  key={childIndex}
                  href={child.href || "#"}
                  className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                >
                  <span>{child.title}</span>
                  {child.badge && (
                    <Badge
                      variant={
                        child.badge === "urgent"
                          ? "destructive"
                          : child.badge === "pro"
                          ? "secondary"
                          : "default"
                      }
                      className={`text-xs ${
                        child.badge === "urgent"
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : child.badge === "new"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : ""
                      }`}
                    >
                      {child.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </CollapsibleContent>
          )}
        </Collapsible>
      </li>
    );
  }

  return (
    <li>
      <Button
        asChild
        variant="ghost"
        className="w-full justify-start px-3 py-2.5 h-auto text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <Link href={item.href || "#"}>
          <div className="flex items-center gap-3">
            {item.icon}
            {showText && (
              <span className="text-sm font-medium">{item.title}</span>
            )}
          </div>
        </Link>
      </Button>
    </li>
  );
}

export function AdminSidebar({
  isOpen,
  isCollapsed,
  isHovered,
  isMobile,
  onClose,
  onMouseEnter,
  onMouseLeave
}: SidebarProps) {
  const sidebarWidth = isCollapsed && !isHovered ? "w-20" : "w-72";
  const showText = !isCollapsed || isHovered;

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
        transition-all duration-300 ease-in-out
        ${
          isMobile
            ? `w-72 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : `${sidebarWidth} translate-x-0`
        }
      `}
      onMouseEnter={!isMobile ? onMouseEnter : undefined}
      onMouseLeave={!isMobile ? onMouseLeave : undefined}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {showText && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              ♻️
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              RIjig Admin
            </div>
          </Link>
        )}

        {!showText && (
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mx-auto">
            ♻️
          </div>
        )}

        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 h-[calc(100vh-64px)]">
        <div className="py-6 px-3 space-y-6">
          <MenuSection
            title="Core Management"
            items={menuItems}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
          <MenuSection
            title="Content & Communications"
            items={contentMenuItems}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
          <MenuSection
            title="Analytics & Administration"
            items={analyticsMenuItems}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
        </div>

        {/* Footer CTA - Only show when not collapsed or when hovered */}
        {showText && (
          <div className="p-4 mx-3 mb-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Recycle className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm">
                RIjig Dashboard
              </h4>
            </div>
            <p className="mb-4 text-green-700 dark:text-green-300 text-xs">
              Platform terpadu untuk mengelola ekosistem pengelolaan sampah yang
              berkelanjutan.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
              >
                Help Center
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs border-green-600 text-green-600 hover:bg-green-50"
              >
                Feedback
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
