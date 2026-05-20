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
      className={cn("flex select-none items-center gap-2.5", className)}
      initial="initial"
      animate="animate"
      whileHover={canAnimate ? "hover" : undefined}
      variants={canAnimate ? logoContainerVariants : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <motion.div
        className="relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-tr from-primary to-primary/80 shadow-md shadow-primary/20"
        style={{ width: size, height: size }}
        variants={canAnimate ? logoMarkVariants : undefined}
        transition={{ type: "spring", stiffness: 500, damping: 24 }}
      >
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white overflow-visible"
        >
          <motion.path
            d="M17 5.5C15.9 4.55 14.25 4 12.3 4C8.95 4 6.5 5.55 6.5 7.95C6.5 10.35 8.65 11.15 12.2 11.75C15.55 12.32 17.5 13.15 17.5 15.6C17.5 18.25 15.05 20 11.65 20C9.35 20 7.4 19.28 6 18"
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
        className="text-lg font-black tracking-tight text-content md:text-xl"
        variants={canAnimate ? logoTextVariants : undefined}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
      >
        Shop
        <motion.span
          className="inline-block text-primary"
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
        <span className="text-primary font-extrabold">hub</span>
      </motion.span>
    </motion.div>
  );
}
