"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  OctagonAlert,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { toast as sonnerToast } from "sonner";

export type ToastVariant = "success" | "error" | "warning" | "info" | "default";

const VARIANT_CONFIG = {
  success: {
    bar: "bg-emerald-500",
    icon: "text-emerald-500",
    Icon: CheckCircle2,
  },
  error: {
    bar: "bg-rose-500",
    icon: "text-rose-500",
    Icon: OctagonAlert,
  },
  warning: {
    bar: "bg-amber-500",
    icon: "text-amber-500",
    Icon: AlertTriangle,
  },
  info: {
    bar: "bg-primary",
    icon: "text-primary",
    Icon: Info,
  },
  default: {
    bar: "bg-primary",
    icon: "text-primary",
    Icon: Info,
  },
};

interface CustomToastProps {
  id: string | number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

export function CustomToast({
  id,
  title,
  description,
  variant,
}: CustomToastProps) {
  const { bar, icon, Icon } = VARIANT_CONFIG[variant];

  return (
    <div
      className={cn(
        // Layout
        "relative flex w-full items-start gap-3 overflow-hidden rounded-xl",
        // Surface — adapts to light/dark via CSS token with glassmorphism
        "border border-content/10 bg-surface/90 backdrop-blur-md shadow-lg shadow-black/10",
        // Padding: space for left bar + close button
        "pl-4 pr-10 py-3.5",
        // Width to fit properly in Toaster container
        "w-full sm:w-[380px]",
      )}
    >
      {/* Left accent bar */}
      <span
        aria-hidden
        className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-xl", bar)}
      />

      {/* Variant icon */}
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", icon)} />

      {/* Text content */}
      <div className="min-w-0 flex-1 flex flex-col gap-0.5">
        <span className="text-sm font-semibold leading-5 text-content">
          {title}
        </span>
        {description ? (
          <span className="text-sm leading-5 text-content/60">
            {description}
          </span>
        ) : null}
      </div>

      {/* Close button */}
      <button
        onClick={() => sonnerToast.dismiss(id)}
        aria-label="Close notification"
        type="button"
        className={cn(
          "absolute right-2.5 top-2.5",
          "flex size-6 items-center justify-center rounded-md",
          "text-content/40 outline-none transition-colors",
          "hover:bg-content/10 hover:text-content",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 cursor-pointer",
        )}
      >
        <X aria-hidden className="size-3.5" />
      </button>
    </div>
  );
}
