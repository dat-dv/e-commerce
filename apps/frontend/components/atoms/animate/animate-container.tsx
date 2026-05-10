"use client";

import { HTMLMotionProps, motion, Variants } from "framer-motion";
import React from "react";

export interface AnimationContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const AnimationContainer = ({
  children,
  className,
  ...props
}: AnimationContainerProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
