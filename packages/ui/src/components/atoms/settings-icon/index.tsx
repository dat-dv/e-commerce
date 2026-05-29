"use client";

import { motion } from "framer-motion";

import { cn } from "../../../utils";
import { type ISettingsIconProps } from "./settings-icon.types";

export default function SettingsIcon({
  isActive = false,
  className,
  size = 20,
  ...rest
}: ISettingsIconProps) {
  return (
    <div
      className={cn(
        "pointer-events-none relative flex items-center justify-center",
        className,
      )}
      {...rest}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="overflow-visible"
        animate={isActive ? { rotate: [0, 35, -18, 10, 0] } : { rotate: 0 }}
        transition={
          isActive ? { duration: 0.8, ease: "easeInOut" } : { duration: 0.2 }
        }
      >
        <motion.path
          d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 1 }}
          animate={
            isActive
              ? { pathLength: [0, 1], scale: [1, 1.12, 0.98, 1] }
              : { pathLength: 1, scale: 1 }
          }
          transition={
            isActive
              ? {
                  pathLength: { duration: 0.5, ease: "easeInOut" },
                  scale: { delay: 0.25, duration: 0.45, ease: "easeInOut" },
                }
              : { duration: 0.2 }
          }
        />
        <motion.path
          d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.4 7.4 0 0 0-1.69-.98L14.5 2.42A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.38 2.65c-.61.24-1.18.56-1.69.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.65-.07.98s.02.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1c.51.4 1.08.73 1.69.98l.38 2.65a.5.5 0 0 0 .5.42h4a.5.5 0 0 0 .5-.42l.38-2.65c.61-.24 1.18-.56 1.69-.98l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 1 }}
          animate={
            isActive
              ? { pathLength: [0, 1], scale: [1, 1.18, 0.96, 1.04, 1] }
              : { pathLength: 1, scale: 1 }
          }
          transition={
            isActive
              ? {
                  pathLength: { duration: 0.6, ease: "easeInOut" },
                  scale: { delay: 0.35, duration: 0.6, ease: "easeInOut" },
                }
              : { duration: 0.2 }
          }
          whileHover={
            !isActive
              ? {
                  rotate: [0, 18, -10, 0],
                  transition: {
                    duration: 0.7,
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                }
              : {}
          }
        />
      </motion.svg>
    </div>
  );
}

SettingsIcon.displayName = "SettingsIcon";

export type { ISettingsIconProps } from "./settings-icon.types";
