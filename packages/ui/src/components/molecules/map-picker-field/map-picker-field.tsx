"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";

import { TYPOGRAPHY } from "../../../tokens";
import { cn } from "../../../utils";
import { IMapPickerFieldProps } from "./map-picker-field.types";

export function MapPickerField({
  label,
  displayValue,
  error,
  disabled,
  labels,
  onOpen,
}: IMapPickerFieldProps) {
  const hasValue = !!displayValue;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label className="text-content/80 ml-1 text-sm font-bold tracking-tight opacity-70">
        {label}
      </label>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && onOpen()}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
          }
        }}
        className={cn(
          "flex h-10 cursor-pointer items-center justify-between rounded-xl border px-4 transition-all duration-300",
          hasValue
            ? "border-primary/40 bg-primary/5 shadow-primary/5 shadow-sm"
            : "border-content/10 bg-white/5 backdrop-blur-xl",
          disabled && "cursor-not-allowed opacity-50 shadow-none",
        )}
      >
        <div className="flex max-w-[80%] items-center gap-3">
          <MapPin className="text-primary h-4 w-4 flex-shrink-0" />
          <span
            className={cn("truncate text-sm", !hasValue && "text-content/40")}
          >
            {displayValue || labels?.placeholder || "Select location"}
          </span>
        </div>
        <span className="text-primary text-xs font-medium">
          {hasValue ? labels?.change || "Change" : labels?.select || "Select"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.span
            role="alert"
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -5 }}
            className={`mt-1 ml-1 block overflow-hidden ${TYPOGRAPHY.badge} tracking-tight text-red-500`}
          >
            {error}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

MapPickerField.displayName = "MapPickerField";
