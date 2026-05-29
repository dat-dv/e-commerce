"use client";

import { motion } from "framer-motion";

import { useTextSelectEvent } from "../../../hooks/use-text-select-event";
import { cn } from "../../../utils";
import { type ILiquidWaveTextProps } from "./liquid-wave-text.types";

const clipPathVariants = {
  rest: {
    clipPath:
      "polygon(0% 100%, 12% 100%, 24% 100%, 38% 100%, 52% 100%, 66% 100%, 80% 100%, 100% 100%, 100% 100%, 0% 100%)",
    opacity: 0,
  },
  hover: {
    clipPath: [
      "polygon(0% 100%, 12% 100%, 24% 100%, 38% 100%, 52% 100%, 66% 100%, 80% 100%, 100% 100%, 100% 100%, 0% 100%)",
      "polygon(0% 82%, 12% 74%, 24% 80%, 38% 70%, 52% 77%, 66% 67%, 80% 73%, 100% 65%, 100% 100%, 0% 100%)",
      "polygon(0% 62%, 12% 68%, 24% 56%, 38% 63%, 52% 52%, 66% 60%, 80% 48%, 100% 56%, 100% 100%, 0% 100%)",
      "polygon(0% 38%, 12% 46%, 24% 34%, 38% 42%, 52% 28%, 66% 36%, 80% 24%, 100% 32%, 100% 100%, 0% 100%)",
      "polygon(0% 16%, 12% 24%, 24% 12%, 38% 20%, 52% 8%, 66% 16%, 80% 6%, 100% 12%, 100% 100%, 0% 100%)",
      "polygon(0% 0%, 12% 0%, 24% 0%, 38% 0%, 52% 0%, 66% 0%, 80% 0%, 100% 0%, 100% 100%, 0% 100%)",
    ],
    opacity: 1,
  },
  active: {
    clipPath:
      "polygon(0% 0%, 12% 0%, 24% 0%, 38% 0%, 52% 0%, 66% 0%, 80% 0%, 100% 0%, 100% 100%, 0% 100%)",
    opacity: 1,
  },
};

export const LiquidWaveText: React.FC<ILiquidWaveTextProps> = ({
  children,
  enableSelection = false,
  isActive = false,
  className,
  activeClassName = "text-primary",
  inactiveClassName = "text-content/70",
}) => {
  const { isSelect, selectProps } = useTextSelectEvent({
    enabled: Boolean(enableSelection),
  });

  const isAnimate = !(enableSelection && isSelect);
  const baseVariant = isActive && isAnimate ? "active" : "rest";
  const interactionVariant = isActive ? "active" : "hover";

  return (
    <motion.span
      className={cn(
        "relative inline-grid overflow-hidden pr-1 align-middle leading-normal",
        className,
        enableSelection
          ? "selection:bg-primary/20 selection:text-primary cursor-text select-text"
          : "select-none",
      )}
      initial={false}
      animate={baseVariant}
      whileHover={isAnimate ? interactionVariant : undefined}
      whileTap={isAnimate && !enableSelection ? interactionVariant : undefined}
      {...selectProps}
    >
      <span
        className={cn(
          "relative col-start-1 row-start-1 transition-colors duration-300",
          isActive ? activeClassName : inactiveClassName,
          enableSelection &&
            "selection:bg-primary/20 selection:text-primary select-text",
        )}
      >
        {children}
      </span>

      <motion.span
        aria-hidden="true"
        className="text-primary pointer-events-none col-start-1 row-start-1 will-change-[clip-path] select-none"
        variants={clipPathVariants}
        transition={{
          clipPath: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.1 },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
};

LiquidWaveText.displayName = "LiquidWaveText";

export type { ILiquidWaveTextProps } from "./liquid-wave-text.types";
export default LiquidWaveText;
