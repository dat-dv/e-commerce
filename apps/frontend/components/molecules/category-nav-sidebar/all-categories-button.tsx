"use client";

import Button from "@/components/atoms/button";
import LiquidWaveText from "@/components/atoms/liquid-wave-text";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { TYPOGRAPHY } from "@/constants/typography";

export function AllCategoriesButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onPress}
      className={cn(
        "group relative mb-1.5 flex h-auto min-h-10 w-full items-center justify-start gap-3 rounded-xl px-3 py-2 text-left",
        active ? "text-primary" : "text-content/55 hover:text-content",
      )}
    >
      {active ? (
        <motion.div
          layoutId="active-category-sidebar"
          className="bg-primary/10 absolute inset-0 rounded-xl"
          transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
        />
      ) : null}
      <span
        className={cn(
          "relative z-10 size-1.5 rounded-full transition-opacity",
          active
            ? "bg-primary opacity-100"
            : "bg-content/20 opacity-0 group-hover:opacity-100",
        )}
      />
      <span className={`relative z-10 truncate ${TYPOGRAPHY.label}`}>
        <LiquidWaveText
          isActive={active}
          className="max-w-full truncate"
          inactiveClassName="text-content/55"
        >
          {label}
        </LiquidWaveText>
      </span>
    </Button>
  );
}
