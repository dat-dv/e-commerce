"use client";

import { SlidersHorizontal } from "lucide-react";

import { TYPOGRAPHY, UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { Button } from "../../atoms/button";
import { IFilterDrawerTriggerProps } from "./filter-drawer-trigger.types";

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
          className={`${TYPOGRAPHY.meta} text-primary tracking-[0.18em] uppercase`}
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
          "border-content/10 text-content/70 hover:border-primary/25 hover:bg-primary/5 hover:text-primary h-10 shrink-0 border px-3 text-sm",
        )}
      >
        <SlidersHorizontal size={16} />
        {buttonLabel}
      </Button>
    </div>
  );
}

FilterDrawerTrigger.displayName = "FilterDrawerTrigger";

export default FilterDrawerTrigger;
