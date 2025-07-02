"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  ClipboardList,
  Package,
  Search,
  Database,
  ShoppingCart,
  DollarSign,
  Settings,
  Recycle,
  TrendingUp,
  FileText,
  Users,
  MapPin,
  ChevronDown,
  X,
  Plus,
  Truck,
  Archive,
  Calculator,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  badgeVariant?: "pro" | "new" | "urgent" | "success";
  children?: MenuItem[];
}

// Menu untuk fitur utama pengelola
const coreMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    children: [
      {
        title: "Overview",
        href: "/pengelola/dashboard"
      },
      {
        title: "Statistik Harian",
        href: "/pengelola/dashboard/daily-stats"
      },
      {
        title: "Performa Tim",
        href: "/pengelola/dashboard/team-performance",
        badge: "new"
      },
      {
        title: "Target & KPI",
        href: "/pengelola/dashboard/targets"
      }
    ]
  },
  {
    title: "Pencatatan Sampah",
    icon: <ClipboardList className="w-5 h-5" />,
    children: [
      {
        title: "Input Sampah Masuk",
        href: "/pengelola/dashboard/wastemanagement",
        badge: "urgent"
      },
      {
        title: "Kategorisasi",
        href: "/pengelola/waste-recording/categorization"
      },
      {
        title: "Verifikasi Data",
        href: "/pengelola/waste-recording/verification"
      },
      {
        title: "Laporan Harian",
        href: "/pengelola/waste-recording/daily-reports"
      },
      {
        title: "Tracking & Monitoring",
        href: "/pengelola/waste-recording/tracking"
      }
    ]
  },
  {
    title: "Pengelolaan Stok",
    icon: <Package className="w-5 h-5" />,
    children: [
      {
        title: "Inventori Sampah",
        href: "/pengelola/inventory/waste-stock"
      },
      {
        title: "Penyortiran",
        href: "/pengelola/inventory/sorting"
      },
      {
        title: "Penyimpanan",
        href: "/pengelola/inventory/storage"
      },
      {
        title: "Quality Control",
        href: "/pengelola/inventory/quality-control",
        badge: "new"
      },
      {
        title: "Stock Opname",
        href: "/pengelola/inventory/stock-taking"
      }
    ]
  }
];

// Menu untuk operasional dan bisnis
const operationalMenuItems: MenuItem[] = [
  {
    title: "Explore",
    icon: <Search className="w-5 h-5" />,
    children: [
      {
        title: "Analisis Pasar",
        href: "/pengelola/dashboard/explorewaste"
      },
      {
        title: "Peluang Bisnis",
        href: "/pengelola/explore/business-opportunities",
        badge: "new"
      },
      {
        title: "Tren Industri",
        href: "/pengelola/explore/industry-trends"
      },
      {
        title: "Kompetitor",
        href: "/pengelola/explore/competitors"
      },
      {
        title: "Research & Development",
        href: "/pengelola/explore/research"
      }
    ]
  },
  {
    title: "Data Master",
    icon: <Database className="w-5 h-5" />,
    children: [
      {
        title: "Jenis Sampah",
        href: "/pengelola/master-data/waste-types"
      },
      {
        title: "Supplier",
        href: "/pengelola/master-data/suppliers"
      },
      {
        title: "Customer",
        href: "/pengelola/master-data/customers"
      },
      {
        title: "Harga & Tarif",
        href: "/pengelola/master-data/pricing"
      },
      {
        title: "Lokasi & Area",
        href: "/pengelola/master-data/locations"
      }
    ]
  },
  {
    title: "Pembelian",
    icon: <ShoppingCart className="w-5 h-5" />,
    children: [
      {
        title: "Purchase Order",
        href: "/pengelola/purchasing/orders"
      },
      {
        title: "Vendor Management",
        href: "/pengelola/purchasing/vendors"
      },
      {
        title: "Negosiasi Harga",
        href: "/pengelola/purchasing/price-negotiation"
      },
      {
        title: "Kontrak & Agreement",
        href: "/pengelola/purchasing/contracts"
      },
      {
        title: "Evaluasi Supplier",
        href: "/pengelola/purchasing/supplier-evaluation",
        badge: "new"
      }
    ]
  }
];

// Menu untuk keuangan dan pengaturan
const managementMenuItems: MenuItem[] = [
  {
    title: "Keuangan",
    icon: <DollarSign className="w-5 h-5" />,
    children: [
      {
        title: "Cash Flow",
        href: "/pengelola/dashboard/cashflow"
      },
      {
        title: "Accounts Receivable",
        href: "/pengelola/finance/receivable",
        badge: "urgent"
      },
      {
        title: "Accounts Payable",
        href: "/pengelola/finance/payable"
      },
      {
        title: "Budget Planning",
        href: "/pengelola/finance/budget-planning"
      },
      {
        title: "Profit & Loss",
        href: "/pengelola/finance/profit-loss"
      },
      {
        title: "Tax Management",
        href: "/pengelola/finance/tax"
      }
    ]
  },
  {
    title: "Pengaturan",
    icon: <Settings className="w-5 h-5" />,
    children: [
      {
        title: "Profil Perusahaan",
        href: "/pengelola/settings/company-profile"
      },
      {
        title: "User Management",
        href: "/pengelola/settings/users"
      },
      {
        title: "Operational Hours",
        href: "/pengelola/settings/operating-hours"
      },
      {
        title: "Notification Settings",
        href: "/pengelola/settings/notifications"
      },
      {
        title: "Data Backup",
        href: "/pengelola/settings/backup",
        badge: "pro"
      },
      {
        title: "System Logs",
        href: "/pengelola/settings/logs"
      }
    ]
  }
];

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
  isCollapsed: boolean;
  isHovered: boolean;
}

function MenuSection({
  title,
  items,
  isCollapsed,
  isHovered
}: MenuSectionProps) {
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
            key={`${title}-${index}`}
            item={item}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
        ))}
      </ul>
    </div>
  );
}

interface MenuItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  isHovered: boolean;
}

function MenuItemComponent({ item, isCollapsed, isHovered }: MenuItemProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const showText = !isCollapsed || isHovered;

  // Check if any child is active
  const isChildActive = useMemo(() => {
    if (!hasChildren) return false;
    return item.children!.some((child) => child.href === pathname);
  }, [hasChildren, item.children, pathname]);

  // Auto open if child is active
  useMemo(() => {
    if (isChildActive && !isOpen) {
      setIsOpen(true);
    }
  }, [isChildActive, isOpen]);

  // For collapsed state without hover, show tooltip
  if (isCollapsed && !isHovered) {
    return (
      <li>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full h-12 p-0 justify-center transition-colors",
                  isChildActive && "bg-green-100 dark:bg-green-900/30"
                )}
                asChild={!hasChildren}
              >
                {hasChildren ? (
                  <div
                    className={cn(
                      "text-gray-700 dark:text-gray-300",
                      isChildActive && "text-green-700 dark:text-green-400"
                    )}
                  >
                    {item.icon}
                  </div>
                ) : (
                  <Link href={item.href || "#"}>
                    <div
                      className={cn(
                        "text-gray-700 dark:text-gray-300",
                        pathname === item.href &&
                          "text-green-700 dark:text-green-400"
                      )}
                    >
                      {item.icon}
                    </div>
                  </Link>
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
              className={cn(
                "w-full justify-between px-3 py-2.5 h-auto transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                isChildActive &&
                  "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "transition-colors",
                    isChildActive
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {item.icon}
                </span>
                {showText && (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isChildActive && "text-green-700 dark:text-green-400"
                    )}
                  >
                    {item.title}
                  </span>
                )}
              </div>
              {showText && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "rotate-180",
                    isChildActive && "text-green-600 dark:text-green-400"
                  )}
                />
              )}
            </Button>
          </CollapsibleTrigger>
          {showText && (
            <CollapsibleContent className="ml-8 mt-1 space-y-1">
              {item.children?.map((child, childIndex) => {
                const isActive = pathname === child.href;
                return (
                  <Link
                    key={childIndex}
                    href={child.href || "#"}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      isActive
                        ? "bg-green-100 text-green-700 font-medium hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/50"
                        : "text-gray-600 dark:text-gray-400"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {isActive && (
                        <div className="w-1 h-4 bg-green-600 rounded-full" />
                      )}
                      {child.title}
                    </span>
                    {child.badge && (
                      <Badge
                        variant={
                          child.badge === "urgent"
                            ? "destructive"
                            : child.badge === "pro"
                            ? "secondary"
                            : child.badge === "success"
                            ? "default"
                            : "default"
                        }
                        className={cn(
                          "text-xs",
                          child.badge === "urgent" &&
                            "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400",
                          child.badge === "new" &&
                            "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400",
                          child.badge === "success" &&
                            "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                        )}
                      >
                        {child.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </CollapsibleContent>
          )}
        </Collapsible>
      </li>
    );
  }

  // Single menu item (no children)
  const isActive = pathname === item.href;

  return (
    <li>
      <Button
        asChild
        variant="ghost"
        className={cn(
          "w-full justify-start px-3 py-2.5 h-auto transition-colors",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          isActive &&
            "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/50"
        )}
      >
        <Link href={item.href || "#"}>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "transition-colors",
                isActive
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              {item.icon}
            </span>
            {showText && (
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive && "text-green-700 dark:text-green-400"
                )}
              >
                {item.title}
              </span>
            )}
          </div>
        </Link>
      </Button>
    </li>
  );
}

export function ManagerSidebar({
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
      className={cn(
        "fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-900",
        "border-r border-gray-200 dark:border-gray-800",
        "transition-all duration-300 ease-in-out",
        isMobile
          ? cn("w-72", isOpen ? "translate-x-0" : "-translate-x-full")
          : cn(sidebarWidth, "translate-x-0")
      )}
      onMouseEnter={!isMobile ? onMouseEnter : undefined}
      onMouseLeave={!isMobile ? onMouseLeave : undefined}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {showText && (
          <Link href="/pengelola/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              ♻️
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              RIjig Manager
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
            title="Core Operations"
            items={coreMenuItems}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
          <MenuSection
            title="Business & Data"
            items={operationalMenuItems}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
          <MenuSection
            title="Finance & Settings"
            items={managementMenuItems}
            isCollapsed={isCollapsed}
            isHovered={isHovered}
          />
        </div>

        {/* Footer CTA - Only show when not collapsed or when hovered */}
        {showText && (
          <div className="p-4 mx-3 mb-6 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Recycle className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm">
                Manager Dashboard
              </h4>
            </div>
            <p className="mb-4 text-green-700 dark:text-green-300 text-xs">
              Platform terintegrasi untuk pengelolaan sampah yang efisien dan
              berkelanjutan.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
              >
                Support
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                Guide
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
