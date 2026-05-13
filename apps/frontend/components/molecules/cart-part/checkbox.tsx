"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange: () => void;
  className?: string;
}

export const Checkbox = ({
  checked,
  onCheckedChange,
  className,
}: CheckboxProps) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onCheckedChange();
      }}
      className={cn(
        "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center flex-shrink-0",
        checked
          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
          : "border-content/[0.1] bg-white/50 backdrop-blur-sm hover:border-content/[0.3]",
        className,
      )}
    >
      {checked && <Check size={14} strokeWidth={4} />}
    </button>
  );
};
