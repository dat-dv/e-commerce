"use client";

import LiquidWaveText from "@/components/atoms/liquid-wave-text";
import { cn } from "@/utils/cn";

interface ParentCategoryItemProps {
  name: string;
  active: boolean;
  highlighted?: boolean;
  onClick: () => void;
  refCallback?: (el: HTMLButtonElement | null) => void;
}

export const ParentCategoryItem = ({
  name,
  active,
  highlighted = false,
  onClick,
  refCallback,
}: ParentCategoryItemProps) => {
  return (
    <button
      ref={refCallback}
      type="button"
      onClick={onClick}
      className={cn(
        "relative pb-2 text-left text-sm font-bold whitespace-nowrap capitalize",
        active ? "text-primary" : "text-content/60",
      )}
    >
      <LiquidWaveText
        isActive={active}
        inactiveClassName={highlighted ? "text-content/90" : "text-content/60"}
      >
        {name}
      </LiquidWaveText>

      {active && (
        <span className="bg-primary absolute bottom-0 left-0 h-[2.5px] w-full rounded-full" />
      )}
    </button>
  );
};
