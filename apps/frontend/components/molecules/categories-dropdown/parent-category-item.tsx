"use client";

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
        "relative whitespace-nowrap pb-2 text-left text-sm font-bold capitalize transition-all",
        active
          ? "text-primary"
          : highlighted
            ? "text-content/90"
            : "text-content/60 hover:text-content/90",
      )}
    >
      {name}

      {active && (
        <span className="absolute bottom-0 left-0 h-[2.5px] w-full rounded-full bg-primary" />
      )}
    </button>
  );
};
