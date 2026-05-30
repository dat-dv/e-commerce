"use client";

import { Button, Logo } from "@ecommerce/ui";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { useAdminSidebarStore } from "@/store/sidebar";
import { useAdminUserStore } from "@/store/user";

interface ISidebarLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

const SIDEBAR_LINKS: ISidebarLink[] = [
  { label: "Dashboard", href: APP_ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Products", href: "/dashboard/products", icon: Tag, disabled: true },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    disabled: true,
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    disabled: true,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    disabled: true,
  },
  { label: "Settings", href: APP_ROUTES.SETTINGS, icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAdminUserStore();
  const { isOpen, isCollapsed, setOpen, toggleCollapsed } =
    useAdminSidebarStore();

  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userInitial = user?.firstName?.charAt(0).toUpperCase() || "A";

  // Close mobile sidebar drawer on path change
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  // Sidebar link rendering helper
  const renderLink = (link: ISidebarLink) => {
    const Icon = link.icon;
    const isActive =
      pathname === link.href ||
      (link.href !== "/dashboard" && pathname.startsWith(link.href));

    return (
      <Link
        key={link.href}
        href={link.disabled ? "#" : link.href}
        onClick={(e) => {
          if (link.disabled) e.preventDefault();
        }}
        className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-300 ${
          isCollapsed ? "justify-center px-0" : ""
        } ${
          link.disabled
            ? "cursor-not-allowed opacity-40 hover:bg-transparent"
            : isActive
              ? "bg-primary/10 text-primary shadow-primary/5 shadow-sm"
              : "text-[var(--sidebar-text)] hover:bg-white/5 hover:text-[var(--app-text)]"
        }`}
      >
        {/* Glow indicator line */}
        {isActive && !link.disabled && (
          <motion.div
            layoutId="active-indicator"
            className="bg-primary absolute top-2.5 bottom-2.5 left-0 w-1 rounded-r-full"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}

        <Icon
          className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isActive ? "text-primary scale-105" : "group-hover:scale-110"}`}
        />

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="truncate"
            >
              {link.label}
              {link.disabled && (
                <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] font-medium tracking-wide uppercase">
                  Soon
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Tooltip for collapsed mode */}
        {isCollapsed && (
          <div className="pointer-events-none absolute left-16 z-50 origin-left scale-90 rounded-md border border-[var(--border-color)] bg-[var(--app-bg)] px-2.5 py-1.5 text-xs font-semibold text-[var(--app-text)] opacity-0 shadow-xl transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
            {link.label} {link.disabled && "(Soon)"}
          </div>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* ── Header / Brand ── */}
      <div
        className={`flex h-16 items-center border-b border-[var(--border-color)] px-4 ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        <Link href={APP_ROUTES.DASHBOARD} className="flex items-center gap-2.5">
          <Logo size={28} showText={!isCollapsed} />
        </Link>
      </div>

      {/* ── Navigation Links ── */}
      <nav className="hide-scrollbar flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {SIDEBAR_LINKS.map(renderLink)}
      </nav>

      {/* ── Footer / User Card ── */}
      <div className="border-t border-[var(--border-color)] p-3">
        {isCollapsed ? (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="rounded-lg text-red-500 hover:bg-red-500/10"
              aria-label="Log Out"
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 rounded-xl border border-[var(--border-color)] bg-white/[0.02] p-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="from-primary/30 to-primary/10 border-primary/20 text-primary flex h-9 w-9 items-center justify-center rounded-full border bg-gradient-to-tr text-sm font-bold">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-[var(--app-text)]">
                  {userName}
                </p>
                <p className="truncate text-[10px] text-[var(--sidebar-text)]">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full justify-start gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-[280px] border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] shadow-2xl backdrop-blur-xl md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ── */}
      <div className="relative hidden shrink-0 md:block">
        <motion.aside
          animate={{ width: isCollapsed ? 80 : 260 }}
          transition={{ type: "spring", damping: 20, stiffness: 150 }}
          className="sticky top-0 h-screen overflow-hidden border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] shadow-sm backdrop-blur-xl"
        >
          {sidebarContent}
        </motion.aside>

        {/* Floating Expand/Collapse Button */}
        <button
          onClick={toggleCollapsed}
          className="animate-in fade-in absolute top-5 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] shadow-md transition-colors duration-300 hover:bg-white/8 hover:text-[var(--app-text)]"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </>
  );
};

Sidebar.displayName = "Sidebar";
