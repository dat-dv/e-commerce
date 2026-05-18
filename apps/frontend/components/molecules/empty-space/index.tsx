"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { type LucideIcon, PackageOpen } from "lucide-react";

import { cn } from "@/utils/cn";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
  className?: string;
  delay?: number;
}

export const EmptyState = ({
  title = "Nothing Here Yet",
  description = "There’s currently no content available in this section.",
  icon: Icon = PackageOpen,
  actionLabel,
  actionHref,
  children,
  className,
  delay = 0.2,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-content/[0.05] bg-surface/60 px-6 py-20",
        className,
      )}
    >
      {/* Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-content) 0.5px, transparent 0.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient Glow */}
      <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="group relative mb-8 flex size-24 items-center justify-center rounded-full border border-content/[0.05] bg-content/[0.02]">
          <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <Icon
            size={38}
            strokeWidth={1.8}
            className="text-content/20 transition-colors duration-500 group-hover:text-primary/50"
          />
        </div>

        <h2 className="text-3xl font-black tracking-tight text-content">
          {title}
        </h2>

        <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-content/40">
          {description}
        </p>

        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="group mt-10 inline-flex items-center justify-center overflow-hidden rounded-full border border-content/[0.08] bg-content px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-surface transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary"
          >
            <span>{actionLabel}</span>
          </Link>
        )}

        {children}
      </div>
    </motion.div>
  );
};

export default EmptyState;
