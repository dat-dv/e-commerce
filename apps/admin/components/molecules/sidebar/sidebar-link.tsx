"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React from "react";

import { ISidebarLink } from "./sidebar.types";

interface ISidebarLinkProps {
  link: ISidebarLink;
  isActive: boolean;
  isCollapsed: boolean;
}

export const SidebarLink = ({
  link,
  isActive,
  isCollapsed,
}: ISidebarLinkProps) => {
  const Icon = link.icon;

  return (
    <Link
      href={link.disabled ? "#" : link.href}
      onClick={(e) => {
        if (link.disabled) e.preventDefault();
      }}
      className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-300 ${
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

SidebarLink.displayName = "SidebarLink";
