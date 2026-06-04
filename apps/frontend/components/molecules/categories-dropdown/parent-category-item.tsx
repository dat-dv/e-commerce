"use client";
import { Button, LiquidWaveText } from "@ecommerce/ui";

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
    <Button
      ref={refCallback}
      variant="ghost"
      size="md"
      onClick={onClick}
      className={cn(
        "relative h-auto justify-start rounded-none px-0 pt-0 pb-2 text-left text-sm font-bold whitespace-nowrap capitalize hover:bg-transparent hover:brightness-100",
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
    </Button>
  );
};
