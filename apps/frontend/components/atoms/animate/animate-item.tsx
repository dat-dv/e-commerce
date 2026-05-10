"use client";

import { HTMLMotionProps, motion, Variants } from "framer-motion";

export interface AnimationItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const AnimationItem = ({
  children,
  className,
  ...props
}: AnimationItemProps) => {
  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
};
