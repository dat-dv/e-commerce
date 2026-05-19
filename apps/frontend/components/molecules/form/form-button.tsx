"use client";

import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import React from "react";

interface FormButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  loadingText?: string;
}

export const FormButton: React.FC<FormButtonProps> = ({
  isLoading,
  loadingText,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const t = useTranslations("Common.form");
  const displayLoadingText = loadingText ?? t("processing");

  return (
    <motion.button
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      disabled={isLoading || disabled}
      className={`
        group relative h-11 w-full rounded-xl bg-primary text-on-primary font-bold 
        shadow-lg shadow-primary/20 transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden ${className}
      `}
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
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-on-primary/30 border-t-on-primary" />
            <span className="tracking-tight">{displayLoadingText}</span>
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
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
    </motion.button>
  );
};
