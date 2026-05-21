"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxCount?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, label, error, className, maxCount, value, ...rest }, ref) => {
    const valueLength = String(value ?? "").length;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={id}
            className="ml-1 text-sm font-bold tracking-tight text-content/80 opacity-70"
          >
            {label}
          </label>
        ) : null}

        <textarea
          {...rest}
          ref={ref}
          id={id}
          value={value}
          maxLength={maxCount}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "min-h-36 w-full resize-y border bg-white/5 px-5 py-3 text-sm font-normal shadow-sm outline-none backdrop-blur-xl transition-all duration-300 placeholder:opacity-50 focus:border-primary focus:ring-1 focus:ring-primary/20",
            UI_RADIUS.input,
            error
              ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] focus:border-red-500"
              : "border-content/10",
            rest.disabled &&
              "cursor-not-allowed border-content/10 bg-content/5 opacity-70 shadow-none",
            className,
          )}
        />

        <div className="flex min-h-4 items-center justify-between gap-3">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.span
                id={`${id}-error`}
                role="alert"
                initial={{ opacity: 0, height: 0, y: -5 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -5 }}
                className="ml-1 overflow-hidden text-[11px] font-bold tracking-tight text-red-500"
              >
                {error}
              </motion.span>
            ) : (
              <span />
            )}
          </AnimatePresence>

          {maxCount ? (
            <span className="shrink-0 text-[11px] font-bold text-content/35">
              {valueLength}/{maxCount}
            </span>
          ) : null}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
