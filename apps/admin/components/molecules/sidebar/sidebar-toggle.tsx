"use client";

import { Button } from "@ecommerce/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface ISidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const SidebarToggle = ({
  isCollapsed,
  onToggle,
}: ISidebarToggleProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onToggle}
      className="animate-in fade-in absolute top-5 -right-3 z-100 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--sidebar-bg)] p-0 text-[var(--sidebar-text)] shadow-md transition-colors duration-300 hover:bg-white/8 hover:text-[var(--app-text)]"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? (
        <ChevronRight className="h-3.5 w-3.5" />
      ) : (
        <ChevronLeft className="h-3.5 w-3.5" />
      )}
    </Button>
  );
};

SidebarToggle.displayName = "SidebarToggle";
