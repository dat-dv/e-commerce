"use client";

import { motion } from "framer-motion";
import React from "react";

import { cn } from "../../../utils";
import { type ISwitchProps } from "./switch.types";

export const Switch = React.forwardRef<HTMLButtonElement, ISwitchProps>(
  ({ checked, onCheckedChange, className, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onCheckedChange}
        className={cn(
          "focus-visible:ring-primary/40 relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none",
          checked ? "bg-primary" : "bg-content/10",
          className,
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";
