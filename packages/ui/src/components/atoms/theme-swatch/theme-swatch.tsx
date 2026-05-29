"use client";

import { motion } from "framer-motion";
import React from "react";

import { cn } from "../../../utils";
import { type IThemeSwatchProps } from "./theme-swatch.types";

export const ThemeSwatch = React.forwardRef<
  HTMLButtonElement,
  IThemeSwatchProps
>(({ color, selected = false, className, children, ...props }, ref) => {
  return (
    <motion.button
      {...props}
      ref={ref}
      type="button"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-all",
        selected
          ? "ring-primary scale-110 ring-2 ring-offset-2"
          : "opacity-70 hover:opacity-100",
        className,
      )}
      style={{ backgroundColor: color, ...props.style }}
    >
      {children}
    </motion.button>
  );
});

ThemeSwatch.displayName = "ThemeSwatch";
