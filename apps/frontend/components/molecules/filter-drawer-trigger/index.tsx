"use client";

import Button from "@/components/atoms/button";
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
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
        <p className="mt-1 truncate text-sm font-medium text-content/45">
          {label}
        </p>
      </div>

      <Button
        variant="ghost"
        onClick={onPress}
        className="h-10 shrink-0 rounded-full border border-content/10 px-3 text-sm text-content/70 hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
      >
        <SlidersHorizontal size={16} />
        {buttonLabel}
      </Button>
    </div>
  );
}
