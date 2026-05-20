"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

interface ICartIconProps {
  isActive?: boolean;
  itemsCount?: number;
  className?: string;
  size?: number;
}

export default function CartIcon({
  isActive = false,
  itemsCount = 0,
  className,
  size = 20,
}: ICartIconProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center pointer-events-none",
        className,
      )}
    >
      <motion.svg
        key={itemsCount}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="overflow-visible"
        animate={
          itemsCount > 0 ? { scale: [1, 1.25, 0.9, 1.1, 1] } : { scale: 1 }
        }
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        <motion.path
          d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
          animate={
            isActive
              ? {
                  pathLength: [0, 1],
                  stroke: "url(#bagGradient)",
                }
              : {
                  pathLength: 1,
                  stroke: "currentColor",
                }
          }
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        <motion.path
          d="M3 6h18"
          animate={
            isActive
              ? {
                  pathLength: [0, 1],
                  stroke: "url(#bagGradient)",
                }
              : {
                  pathLength: 1,
                  stroke: "currentColor",
                }
          }
          transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
        />
        <motion.path
          d="M16 10a4 4 0 0 1-8 0"
          animate={
            isActive
              ? {
                  pathLength: [0, 1],
                  stroke: "url(#bagGradient)",
                }
              : {
                  pathLength: 1,
                  stroke: "currentColor",
                }
          }
          transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
}
