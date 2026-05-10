'use client';

import { motion } from 'framer-motion';
import React from 'react';

export const DocsAnimationWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full"
    >
      {/* Subtle side accent line */}
      <div className="absolute -left-12 top-0 h-full w-[1px] bg-gradient-to-b from-primary/30 via-primary/5 to-transparent hidden lg:block rounded-full opacity-40" />

      <div className="py-12 pb-24 lg:px-6">{children}</div>
    </motion.div>
  );
};
