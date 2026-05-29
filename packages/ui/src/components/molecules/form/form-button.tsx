"use client";

import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import React from "react";

export interface IFormButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  loadingText?: string;
}

export const FormButton = ({
  isLoading,
  loadingText = "Processing...",
  children,
  className = "",
  disabled,
  ...props
}: IFormButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      disabled={isLoading || disabled}
      className={`group bg-primary text-on-primary shadow-primary/20 relative h-11 w-full overflow-hidden rounded-xl font-bold shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${className} `}
      {...props}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2 px-4"
          >
            <div className="border-on-primary/30 border-t-on-primary h-5 w-5 animate-spin rounded-full border-2" />
            <span className="tracking-tight">{loadingText}</span>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shine effect on hover */}
      <div className="group-hover:animate-shimmer pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </motion.button>
  );
};

FormButton.displayName = "FormButton";
