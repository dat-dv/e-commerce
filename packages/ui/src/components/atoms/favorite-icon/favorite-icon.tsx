"use client";

import { motion } from "framer-motion";

import { cn } from "../../../utils";
import { type IFavoriteIconProps } from "./favorite-icon.types";

export default function FavoriteIcon({
  isActive = false,
  className,
  size = 20,
  ...rest
}: IFavoriteIconProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative flex items-center justify-center",
        className,
      )}
      {...rest}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="overflow-visible"
      >
        <motion.path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 1, fill: "none" }}
          animate={
            isActive
              ? {
                  pathLength: [0, 1],
                  fill: "none",
                  stroke: "currentColor",
                  scale: [1, 1.22, 0.95, 1.05, 1],
                }
              : {
                  pathLength: 1,
                  fill: "none",
                  stroke: "currentColor",
                  scale: 1,
                }
          }
          transition={
            isActive
              ? {
                  pathLength: { duration: 0.6, ease: "easeInOut" },
                  scale: { delay: 0.4, duration: 0.6, ease: "easeInOut" },
                }
              : { duration: 0.2 }
          }
          whileHover={
            !isActive
              ? {
                  scale: [1, 1.15, 1],
                  transition: {
                    duration: 0.6,
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                }
              : {}
          }
        />
      </svg>
    </div>
  );
}

FavoriteIcon.displayName = "FavoriteIcon";
