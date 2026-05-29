"use client";

import { X } from "lucide-react";
import React, { Fragment } from "react";

import { TYPOGRAPHY, UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import Button from "../../atoms/button";

export interface AppliedFiltersBarProps<T extends string = string> {
  chips?: { key: T; label: string }[];
  onClearFilter: (key: T) => void;
  onResetFilters: () => void;
  appliedLabel?: string;
  resetAllLabel?: string;
  className?: string;
}

/**
 * AppliedFiltersBar displays a list of active filter chips with options to clear individual ones or reset all.
 */
export function AppliedFiltersBar<T extends string = string>({
  chips = [],
  onClearFilter,
  onResetFilters,
  appliedLabel = "Applied",
  resetAllLabel = "Reset All",
  className,
}: AppliedFiltersBarProps<T>) {
  if (!chips || chips.length === 0) return null;

  return (
    <div
      className={cn(
        UI_RADIUS.panel,
        "border-content/[0.06] bg-content/[0.02] mb-6 flex flex-wrap items-center gap-2 border p-3",
        className,
      )}
    >
      <span
        className={`mr-1 ${TYPOGRAPHY.badge} text-content/35 tracking-widest uppercase`}
      >
        {appliedLabel}
      </span>
      {chips.map((chip, idx) => {
        if (!chip.label || chip.label.trim() === "")
          return <Fragment key={idx} />;
        return (
          <Button
            key={chip.key}
            variant="ghost"
            onClick={() => onClearFilter(chip.key)}
            className={`border-primary/15 bg-primary/10 inline-flex h-8 items-center gap-2 rounded-full border px-3 ${TYPOGRAPHY.caption} text-primary hover:bg-primary/15 font-bold opacity-100 transition-colors hover:opacity-100 active:scale-95`}
          >
            {chip.label}
            <X size={13} />
          </Button>
        );
      })}
      <Button
        variant="ghost"
        onClick={onResetFilters}
        className={`border-content/10 ml-auto h-8 rounded-full border px-3 ${TYPOGRAPHY.caption} text-content/45 hover:border-primary/30 hover:text-primary font-bold opacity-100 transition-colors hover:bg-transparent hover:opacity-100 active:scale-95`}
      >
        {resetAllLabel}
      </Button>
    </div>
  );
}

export default AppliedFiltersBar;
