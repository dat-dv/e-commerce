"use client";

import { motion } from "framer-motion";
import React from "react";

export const DocsAnimationWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full"
    >
      {/* Subtle side accent line */}
      <div className="from-primary/30 via-primary/5 absolute top-0 -left-12 hidden h-full w-[1px] rounded-full bg-gradient-to-b to-transparent opacity-40 lg:block" />

      <div className="py-12 pb-24 lg:px-6">{children}</div>
    </motion.div>
  );
};

DocsAnimationWrapper.displayName = "DocsAnimationWrapper";
