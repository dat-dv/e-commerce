"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { useHeaderStore } from "@/hooks/config/use-header-store";
import LiquidWaveText from "@/components/atoms/liquid-wave-text";

interface CategoryHeaderNavProps {
  label: string;
  isActive: boolean;
}

export const CategoryHeaderNav = ({
  label,
  isActive,
}: CategoryHeaderNavProps) => {
  const { isOpenCategory, setIsOpenCategory } = useHeaderStore();

  const toggleMenu = () => {
    setIsOpenCategory(!isOpenCategory);
  };

  return (
    <div className="relative h-full flex items-center">
      <button
        onClick={toggleMenu}
        className={cn(
          "relative flex h-full items-center gap-1.5 px-2 text-sm font-bold",
          isActive ? "text-primary" : "text-content/70",
        )}
      >
        <LiquidWaveText isActive={isActive}>{label}</LiquidWaveText>

        <ChevronDown
          size={14}
          className={cn(
            "transition-all duration-300",
            isOpenCategory
              ? "rotate-180 text-primary opacity-100"
              : "opacity-40",
          )}
        />

        {isActive && (
          <span className="absolute -bottom-[22px] left-0 h-[2.5px] w-full bg-primary rounded-full shadow-[0_-2px_8px_rgba(var(--primary),0.4)]" />
        )}
      </button>
    </div>
  );
};
