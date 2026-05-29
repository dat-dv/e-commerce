"use client";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  OctagonAlert,
  X,
} from "lucide-react";
import { toast as sonnerToast } from "sonner";

import { cn } from "../../../utils";

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
  const removeToast = () => {
    sonnerToast.dismiss(id);
  };
  return (
    <div
      className={cn(
        // Layout
        "relative flex w-full items-start gap-3 overflow-hidden rounded-xl",
        // Surface — adapts to light/dark via CSS token with glassmorphism
        "border-content/10 bg-surface/90 border shadow-lg shadow-black/10 backdrop-blur-md",
        // Padding: space for left bar + close button
        "py-3.5 pr-10 pl-4",
        // Width to fit properly in Toaster container
        "w-full sm:w-[380px]",
      )}
      onClick={removeToast}
    >
      {/* Left accent bar */}
      <span
        aria-hidden
        className={cn("absolute top-0 bottom-0 left-0 w-1 rounded-l-xl", bar)}
      />

      {/* Variant icon */}
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", icon)} />

      {/* Text content */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-content text-sm leading-5 font-semibold">
          {title}
        </span>
        {description ? (
          <span className="text-content/60 text-sm leading-5">
            {description}
          </span>
        ) : null}
      </div>

      {/* Close button */}
      <button
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          removeToast();
        }}
        aria-label="Close notification"
        type="button"
        className={cn(
          "absolute top-2.5 right-2.5",
          "flex size-6 items-center justify-center rounded-md",
          "text-content/40 transition-colors outline-none",
          "hover:bg-content/10 hover:text-content",
          "focus-visible:ring-primary cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-1",
        )}
      >
        <X aria-hidden className="size-3.5" />
      </button>
    </div>
  );
}

CustomToast.displayName = "CustomToast";
