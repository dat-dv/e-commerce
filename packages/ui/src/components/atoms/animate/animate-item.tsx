"use client";

import { motion, type Variants } from "framer-motion";

import { type IAnimationItemProps } from "./animate.types";

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const AnimationItem = ({
  children,
  className,
  ...props
}: IAnimationItemProps) => {
  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
};

AnimationItem.displayName = "AnimationItem";
