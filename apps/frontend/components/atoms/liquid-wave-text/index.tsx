"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ILiquidWaveTextProps {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export default function LiquidWaveText({
  children,
  isActive = false,
  className,
  activeClassName = "text-primary",
  inactiveClassName = "text-content/70",
}: ILiquidWaveTextProps) {
  return (
    <motion.span
      className={cn(
        "relative inline-grid overflow-hidden align-middle leading-normal",
        className,
      )}
      initial={false}
      animate={isActive ? "active" : "rest"}
      whileHover={isActive ? "active" : "hover"}
    >
      <span
        className={cn(
          "col-start-1 row-start-1 transition-colors duration-300 will-change-[color]",
          isActive ? activeClassName : inactiveClassName,
        )}
      >
        {children}
      </span>

      <motion.span
        aria-hidden="true"
        className="pointer-events-none col-start-1 row-start-1 text-primary will-change-[clip-path]"
        variants={{
          rest: {
            clipPath:
              "polygon(0% 100%, 12% 100%, 24% 100%, 38% 100%, 52% 100%, 66% 100%, 80% 100%, 100% 100%, 100% 100%, 0% 100%)",
          },
          hover: {
            clipPath: [
              "polygon(0% 100%, 12% 100%, 24% 100%, 38% 100%, 52% 100%, 66% 100%, 80% 100%, 100% 100%, 100% 100%, 0% 100%)",
              "polygon(0% 78%, 12% 70%, 24% 76%, 38% 66%, 52% 73%, 66% 63%, 80% 69%, 100% 61%, 100% 100%, 0% 100%)",
              "polygon(0% 48%, 12% 56%, 24% 44%, 38% 52%, 52% 39%, 66% 47%, 80% 36%, 100% 43%, 100% 100%, 0% 100%)",
              "polygon(0% 18%, 12% 25%, 24% 15%, 38% 22%, 52% 10%, 66% 18%, 80% 8%, 100% 14%, 100% 100%, 0% 100%)",
              "polygon(0% 0%, 12% 0%, 24% 0%, 38% 0%, 52% 0%, 66% 0%, 80% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ],
          },
          active: {
            clipPath:
              "polygon(0% 0%, 12% 0%, 24% 0%, 38% 0%, 52% 0%, 66% 0%, 80% 0%, 100% 0%, 100% 100%, 0% 100%)",
          },
        }}
        transition={{ duration: 0.86, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>

      {!isActive && (
        <>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] rounded-[46%_54%_0_0] bg-primary/12 will-change-transform"
            variants={{
              rest: { y: "118%", x: "-8%", opacity: 0, rotate: 0, scaleX: 1 },
              hover: {
                y: ["118%", "62%", "36%", "10%", "-8%"],
                x: ["-8%", "7%", "-6%", "4%", "0%"],
                rotate: [0, -1.2, 1.2, -0.6, 0],
                opacity: [0, 0.5, 0.38, 0.22, 0],
                scaleX: [1, 1.08, 0.96, 1.05, 1],
              },
              active: {
                y: "-8%",
                x: "0%",
                opacity: 0,
                rotate: 0,
                scaleX: 1,
              },
            }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] rounded-[50%] bg-primary/10 will-change-transform"
            variants={{
              rest: { y: "130%", rotate: 0, opacity: 0 },
              hover: {
                y: ["130%", "68%", "32%", "0%"],
                x: ["6%", "-5%", "5%", "-2%"],
                rotate: [0, 1.5, -1.5, 0.5],
                opacity: [0, 0.32, 0.2, 0],
              },
              active: { y: "0%", x: "0%", rotate: 0, opacity: 0 },
            }}
            transition={{ duration: 0.92, ease: [0.22, 1, 0.36, 1] }}
          />
        </>
      )}
    </motion.span>
  );
}
