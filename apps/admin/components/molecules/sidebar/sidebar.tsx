"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Tag,
  UserCog,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

import { APP_ROUTES } from "@/constants/routes";
import { useAdminSidebarStore } from "@/store/sidebar";
import { useAdminUserStore } from "@/store/user";

import { ISidebarLink } from "./sidebar.types";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarHeader } from "./sidebar-header";
import { SidebarLink } from "./sidebar-link";
import { SidebarToggle } from "./sidebar-toggle";

const SIDEBAR_LINKS: ISidebarLink[] = [
  { label: "Dashboard", href: APP_ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Products", href: APP_ROUTES.PRODUCTS, icon: Tag },
  {
    label: "Orders",
    href: APP_ROUTES.ORDERS,
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    href: APP_ROUTES.CUSTOMERS,
    icon: Users,
  },
  {
    label: "Roles",
    href: APP_ROUTES.PERMISSIONS,
    icon: ShieldCheck,
  },
  {
    label: "Assign Roles",
    href: APP_ROUTES.ASSIGN_ROLES,
    icon: UserCog,
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

  // Close mobile sidebar drawer on path change
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <SidebarHeader isCollapsed={isCollapsed} />

      {/* Navigation Links */}
      <nav className="hide-scrollbar flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
        {SIDEBAR_LINKS.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));

          return (
            <SidebarLink
              key={link.href}
              link={link}
              isActive={isActive}
              isCollapsed={isCollapsed}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <SidebarFooter user={user} isCollapsed={isCollapsed} onLogout={logout} />
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Drawer */}
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

      {/* Desktop Sidebar */}
      <motion.div
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        className="relative sticky top-0 z-50 hidden h-screen shrink-0 md:block"
      >
        <aside className="h-full w-full overflow-hidden border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] shadow-sm backdrop-blur-xl">
          {sidebarContent}
        </aside>

        {/* Floating Expand/Collapse Button */}
        <SidebarToggle isCollapsed={isCollapsed} onToggle={toggleCollapsed} />
      </motion.div>
    </>
  );
};

Sidebar.displayName = "Sidebar";
