"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { TYPOGRAPHY, UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { type ITextareaProps } from "./textarea.types";

export const Textarea = React.forwardRef<HTMLTextAreaElement, ITextareaProps>(
  ({ id, label, error, className, maxCount, value, ...rest }, ref) => {
    const valueLength = String(value ?? "").length;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={id}
            className="text-content/80 ml-1 text-sm font-bold tracking-tight opacity-70"
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
            "focus:border-primary focus:ring-primary/20 min-h-36 w-full resize-y border bg-white/5 px-5 py-3 text-sm font-normal shadow-sm backdrop-blur-xl transition-all duration-300 outline-none placeholder:opacity-50 focus:ring-1",
            UI_RADIUS.input,
            error
              ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] focus:border-red-500"
              : "border-content/10",
            rest.disabled &&
              "border-content/10 bg-content/5 cursor-not-allowed opacity-70 shadow-none",
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
                className={`ml-1 overflow-hidden ${TYPOGRAPHY.badge} tracking-tight text-red-500`}
              >
                {error}
              </motion.span>
            ) : (
              <span />
            )}
          </AnimatePresence>

          {maxCount ? (
            <span className={`shrink-0 ${TYPOGRAPHY.badge} text-content/35`}>
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
