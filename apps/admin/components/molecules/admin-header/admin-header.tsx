"use client";

import { Button, Logo } from "@ecommerce/ui";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { BellIcon, MenuIcon } from "@/components/atoms/icons";
import { APP_ROUTES } from "@/constants/routes";

import { AdminUserDropdown } from "./admin-user-dropdown";

interface IAdminHeaderProps {
  onMenuToggle?: () => void;
}

export const AdminHeader = ({ onMenuToggle }: IAdminHeaderProps) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[var(--app-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
        {/* ── Left: Sidebar toggle + Brand ── */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            aria-label="Toggle sidebar"
            className="rounded-lg text-[var(--sidebar-text)] hover:bg-white/8 hover:text-[var(--app-text)] md:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>

          {/* Brand mark */}
          <div className="flex items-center gap-2.5 md:hidden">
            <Logo size={28} />
            <span className="bg-primary/10 text-primary hidden rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase sm:block">
              Admin
            </span>
          </div>
        </div>

        {/* ── Right: Actions + User menu ── */}
        <div className="flex items-center gap-1">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative rounded-lg text-[var(--sidebar-text)] hover:bg-white/8 hover:text-[var(--app-text)]"
          >
            <BellIcon className="h-5 w-5" />
            {/* Unread badge — remove when wiring up real notifications */}
            <span
              aria-hidden="true"
              className="bg-primary absolute top-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-[var(--app-bg)]"
            />
          </Button>

          {/* Settings */}
          <Button
            linkComponent={Link}
            href={APP_ROUTES.SETTINGS}
            variant="ghost"
            size="icon"
            aria-label="Settings"
            className="rounded-lg text-[var(--sidebar-text)] hover:bg-white/8 hover:text-[var(--app-text)]"
            title="Interface Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* Divider */}
          <div className="mx-2 h-5 w-px bg-white/10" aria-hidden="true" />

          {/* User menu */}
          <AdminUserDropdown
            isOpen={userMenuOpen}
            onToggle={() => setUserMenuOpen((v) => !v)}
            onClose={() => setUserMenuOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};

AdminHeader.displayName = "AdminHeader";
