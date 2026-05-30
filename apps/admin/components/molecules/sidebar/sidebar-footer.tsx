"use client";

import { Button } from "@ecommerce/ui";
import { LogOut } from "lucide-react";
import React from "react";

import { IAdminUser } from "@/domain/user";

interface ISidebarFooterProps {
  user: IAdminUser | null;
  isCollapsed: boolean;
  onLogout: () => void;
}

export const SidebarFooter = ({
  user,
  isCollapsed,
  onLogout,
}: ISidebarFooterProps) => {
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userInitial = user?.firstName?.charAt(0).toUpperCase() || "A";

  return (
    <div className="border-t border-[var(--border-color)] p-3">
      {isCollapsed ? (
        <div>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="group relative flex w-full items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold text-red-500 transition-all duration-300 hover:bg-red-500/10"
            aria-label="Log Out"
            title="Log Out"
          >
            <LogOut className="h-5 w-5 shrink-0" />
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
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
};

SidebarFooter.displayName = "SidebarFooter";
