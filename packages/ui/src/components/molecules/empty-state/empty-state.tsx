"use client";

import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";

import { TYPOGRAPHY } from "../../../tokens";
import { cn } from "../../../utils";
import { IEmptyStateProps } from "./empty-state.types";

export const EmptyState = ({
  title = "No data found",
  description = "There is no information to display at this time.",
  icon: Icon = PackageOpen,
  actionLabel,
  actionHref,
  linkComponent: LinkComponent = "a",
  children,
  className,
  delay = 0.2,
}: IEmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay }}
      className={cn(
        "border-content/[0.05] bg-surface/60 relative overflow-hidden rounded-3xl border px-6 py-20",
        className,
      )}
    >
      {/* Grid Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-content) 0.5px, transparent 0.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient Glow */}
      <div className="bg-primary/5 absolute top-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="group border-content/[0.05] bg-content/[0.02] relative mb-8 flex size-24 items-center justify-center rounded-full border">
          <div className="bg-primary/5 absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <Icon
            size={38}
            strokeWidth={1.8}
            className="text-content/20 group-hover:text-primary/50 transition-colors duration-500"
          />
        </div>

        <h2 className={`${TYPOGRAPHY.pageTitle} text-content tracking-tight`}>
          {title}
        </h2>

        <p
          className={`mt-3 max-w-md ${TYPOGRAPHY.bodySmall} text-content/40 leading-relaxed font-medium`}
        >
          {description}
        </p>

        {actionLabel && actionHref && (
          <LinkComponent
            href={actionHref}
            className="group border-content/[0.08] bg-content text-surface hover:border-primary hover:bg-primary mt-10 inline-flex items-center justify-center overflow-hidden rounded-full border px-8 py-4 text-xs font-black tracking-[0.18em] uppercase transition-all hover:-translate-y-0.5"
          >
            <span>{actionLabel}</span>
          </LinkComponent>
        )}

        {children}
      </div>
    </motion.div>
  );
};

EmptyState.displayName = "EmptyState";

export default EmptyState;
