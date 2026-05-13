"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/utils/cn";

interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
  className?: string;
}

export const QuantitySelector = ({
  value,
  onChange,
  disabled,
  className,
}: QuantitySelectorProps) => {
  return (
    <div
      className={cn(
        "flex items-center border border-content/[0.1] rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-sm",
        disabled ? "opacity-50 pointer-events-none" : "",
        className,
      )}
    >
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="p-1.5 hover:bg-content/[0.05] transition-colors text-content/40 hover:text-content border-r border-content/[0.1]"
        disabled={disabled}
      >
        <Minus size={14} />
      </button>
      <span className="px-3 min-w-[36px] text-center text-sm font-bold text-content">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="p-1.5 hover:bg-content/[0.05] transition-colors text-content/40 hover:text-content border-l border-content/[0.1]"
        disabled={disabled}
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
