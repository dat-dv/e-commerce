"use client";

import { cn } from "@/utils/cn";
import { motion, useReducedMotion } from "framer-motion";

interface ILogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

const logoContainerVariants = {
  initial: { y: 0 },
  animate: { y: 0 },
  hover: { y: -1 },
};

const logoMarkVariants = {
  initial: { rotate: 0, scale: 1 },
  animate: { rotate: 0, scale: 1 },
  hover: { rotate: -4, scale: 1.04 },
};

const logoTextVariants = {
  initial: { x: 0 },
  animate: { x: 0 },
  hover: { x: 2 },
};

export default function Logo({
  className,
  size = 32,
  animate = true,
}: ILogoProps) {
  const shouldReduceMotion = useReducedMotion();
  const canAnimate = animate && !shouldReduceMotion;

  return (
    <motion.div
      className={cn("flex items-center gap-0.5 select-none", className)}
      initial="initial"
      animate="animate"
      whileHover={canAnimate ? "hover" : undefined}
      variants={canAnimate ? logoContainerVariants : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <motion.div
        className="from-primary to-primary/80 shadow-primary/20 relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-tr shadow-md"
        style={{ width: size, height: size }}
        variants={canAnimate ? logoMarkVariants : undefined}
        transition={{ type: "spring", stiffness: 500, damping: 24 }}
      >
        <svg
          width={size * 0.62}
          height={size * 0.62}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="overflow-visible text-white"
        >
          <motion.path
            d="M18.5 5.7C16.9 4.2 14.7 3.4 12.2 3.4C7.1 3.4 3.7 6.9 3.7 12C3.7 17.1 7.1 20.6 12.2 20.6C14.7 20.6 16.9 19.8 18.5 18.3"
            initial={
              canAnimate
                ? { pathLength: 0, opacity: 0 }
                : { pathLength: 1, opacity: 1 }
            }
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 1.2, ease: "easeOut" },
              opacity: { duration: 0.5 },
            }}
          />
        </svg>

        <motion.div
          className="absolute inset-y-0 -left-8 w-5 rotate-12 bg-white/35"
          variants={
            canAnimate
              ? {
                  initial: { x: 0, opacity: 0 },
                  animate: { x: 0, opacity: 0 },
                  hover: { x: size + 48, opacity: [0, 1, 0] },
                }
              : undefined
          }
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      </motion.div>

      <motion.span
        className="text-content text-lg font-black tracking-tight md:text-xl"
        variants={canAnimate ? logoTextVariants : undefined}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        hot
        <motion.span
          className="text-primary inline-block"
          variants={
            canAnimate
              ? {
                  initial: { y: 0, scale: 1 },
                  animate: { y: 0, scale: 1 },
                  hover: { y: -2, scale: 1.2 },
                }
              : undefined
          }
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
        >
          .
        </motion.span>
        <span className="text-primary font-extrabold">don</span>
      </motion.span>
    </motion.div>
  );
}
