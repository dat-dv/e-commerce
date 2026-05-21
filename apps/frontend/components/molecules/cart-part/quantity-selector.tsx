"use client";

import Button from "@/components/atoms/button";
import { UI_RADIUS } from "@/constants/ui-radius";
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
        UI_RADIUS.control,
        "border-content/[0.1] flex items-center overflow-hidden border bg-white/50 shadow-sm backdrop-blur-sm",
        disabled ? "pointer-events-none opacity-50" : "",
        className,
      )}
    >
      <Button
        variant="ghost"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="hover:bg-content/[0.05] text-content/40 hover:text-content border-content/[0.1] h-auto rounded-none border-r p-1.5 font-normal opacity-100 transition-colors hover:opacity-100 active:scale-100"
        disabled={disabled}
        aria-label={t("decrease")}
      >
        <Minus size={14} aria-hidden />
      </Button>
      <span className="text-content min-w-[36px] px-3 text-center text-sm font-bold">
        {value}
      </span>
      <Button
        variant="ghost"
        onClick={() => onChange(value + 1)}
        className="hover:bg-content/[0.05] text-content/40 hover:text-content border-content/[0.1] h-auto rounded-none border-l p-1.5 font-normal opacity-100 transition-colors hover:opacity-100 active:scale-100"
        disabled={disabled}
        aria-label={t("increase")}
      >
        <Plus size={14} aria-hidden />
      </Button>
    </div>
  );
};
