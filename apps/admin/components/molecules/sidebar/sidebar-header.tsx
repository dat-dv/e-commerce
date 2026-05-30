"use client";

import { Logo } from "@ecommerce/ui";
import Link from "next/link";

import { APP_ROUTES } from "@/constants/routes";

interface ISidebarHeaderProps {
  isCollapsed: boolean;
}

export const SidebarHeader = ({ isCollapsed }: ISidebarHeaderProps) => {
  return (
    <div
      className={`flex h-16 items-center border-b border-[var(--border-color)] px-4 ${
        isCollapsed ? "justify-center" : "justify-between"
      }`}
    >
      <Link href={APP_ROUTES.DASHBOARD} className="flex items-center gap-2.5">
        <Logo size={28} showText={!isCollapsed} />
      </Link>
    </div>
  );
};

SidebarHeader.displayName = "SidebarHeader";
