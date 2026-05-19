"use client";

import Button from "@/components/atoms/button";
import { cn } from "@/utils/cn";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("CartPage.quantity");

  return (
    <div
      className={cn(
        "flex items-center border border-content/[0.1] rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-sm",
        disabled ? "opacity-50 pointer-events-none" : "",
        className,
      )}
    >
      <Button
        variant="ghost"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="p-1.5 hover:bg-content/[0.05] transition-colors text-content/40 hover:text-content rounded-none border-r border-content/[0.1] h-auto active:scale-100 hover:opacity-100 opacity-100 font-normal"
        disabled={disabled}
        aria-label={t("decrease")}
      >
        <Minus size={14} aria-hidden />
      </Button>
      <span className="px-3 min-w-[36px] text-center text-sm font-bold text-content">
        {value}
      </span>
      <Button
        variant="ghost"
        onClick={() => onChange(value + 1)}
        className="p-1.5 hover:bg-content/[0.05] transition-colors text-content/40 hover:text-content rounded-none border-l border-content/[0.1] h-auto active:scale-100 hover:opacity-100 opacity-100 font-normal"
        disabled={disabled}
        aria-label={t("increase")}
      >
        <Plus size={14} aria-hidden />
      </Button>
    </div>
  );
};
