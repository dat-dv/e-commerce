"use client";

import Button from "@/components/atoms/button";
import { TYPOGRAPHY } from "@/constants/typography";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { SlidersHorizontal } from "lucide-react";

interface IFilterDrawerTriggerProps {
  eyebrow: string;
  label: string;
  buttonLabel: string;
  onPress: () => void;
}

export function FilterDrawerTrigger({
  eyebrow,
  label,
  buttonLabel,
  onPress,
}: IFilterDrawerTriggerProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p
          className={`${TYPOGRAPHY.meta} uppercase tracking-[0.18em] text-primary`}
        >
          {eyebrow}
        </p>
        <p className={`mt-1 truncate ${TYPOGRAPHY.bodySmall} text-content/45`}>
          {label}
        </p>
      </div>

      <Button
        variant="ghost"
        onClick={onPress}
        className={cn(
          UI_RADIUS.control,
          "h-10 shrink-0 border border-content/10 px-3 text-sm text-content/70 hover:border-primary/25 hover:bg-primary/5 hover:text-primary",
        )}
      >
        <SlidersHorizontal size={16} />
        {buttonLabel}
      </Button>
    </div>
  );
}
