"use client";

import { motion } from "framer-motion";

import { cn } from "../../../utils";
import { type ICartIconProps } from "./cart-icon.types";

export default function CartIcon({
  isActive = false,
  itemsCount = 0,
  className,
  size = 20,
  ...rest
}: ICartIconProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative flex items-center justify-center",
        className,
      )}
      {...rest}
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
          <linearGradient id="cartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Path 1: Handle & Bottom Support Frame */}
        <motion.path
          d="M2 2h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78"
          animate={
            isActive
              ? { pathLength: [0, 1], stroke: "url(#cartGradient)" }
              : { pathLength: 1, stroke: "currentColor" }
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Path 2: Basket Frame */}
        <motion.path
          d="M18.44 16l1.65-7.43H5.12"
          animate={
            isActive
              ? { pathLength: [0, 1], stroke: "url(#cartGradient)" }
              : { pathLength: 1, stroke: "currentColor" }
          }
          transition={{ duration: 0.4, delay: 0.15, ease: "easeInOut" }}
        />

        {/* Wheel 1 */}
        <motion.circle
          cx="9"
          cy="20.5"
          r="1.5"
          initial={false}
          animate={
            isActive
              ? {
                  scale: [0, 1.2, 1],
                  fill: "url(#cartGradient)",
                  stroke: "url(#cartGradient)",
                }
              : { scale: 1, fill: "currentColor", stroke: "currentColor" }
          }
          transition={{ duration: 0.3, delay: 0.3 }}
        />

        {/* Wheel 2 */}
        <motion.circle
          cx="18"
          cy="20.5"
          r="1.5"
          initial={false}
          animate={
            isActive
              ? {
                  scale: [0, 1.2, 1],
                  fill: "url(#cartGradient)",
                  stroke: "url(#cartGradient)",
                }
              : { scale: 1, fill: "currentColor", stroke: "currentColor" }
          }
          transition={{ duration: 0.3, delay: 0.35 }}
        />
      </motion.svg>
    </div>
  );
}

CartIcon.displayName = "CartIcon";

export type { ICartIconProps } from "./cart-icon.types";
