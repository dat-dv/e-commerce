"use client";

import { motion, type Variants } from "framer-motion";

import { type IAnimationContainerProps } from "./animate.types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const AnimationContainer = ({
  children,
  className,
  ...props
}: IAnimationContainerProps) => {
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

AnimationContainer.displayName = "AnimationContainer";

export default AnimationContainer;
