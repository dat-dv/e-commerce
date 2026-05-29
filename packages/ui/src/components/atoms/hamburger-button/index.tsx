"use client";

import Button from "@/components/atoms/button";
import { cn } from "@/utils/cn";

interface IHamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaLabel: string;
  className?: string;
  title?: string;
}

export default function HamburgerButton({
  isOpen,
  onClick,
  ariaLabel,
  className,
  title,
}: IHamburgerButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "text-content/60 hover:bg-content/5 hover:text-content size-9 rounded-full p-0 transition-colors",
        className,
      )}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      title={title ?? ariaLabel}
    >
      <span className="relative block h-4 w-5" aria-hidden="true">
        <span
          className={cn(
            "absolute top-0.5 left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out motion-reduce:transition-none",
            isOpen && "translate-y-[6px] rotate-45",
          )}
        />
        <span
          className={cn(
            "absolute top-[7px] left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-200 ease-out motion-reduce:transition-none",
            isOpen && "scale-x-0 opacity-0",
          )}
        />
        <span
          className={cn(
            "absolute top-[13px] left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out motion-reduce:transition-none",
            isOpen && "-translate-y-[6px] -rotate-45",
          )}
        />
      </span>
    </Button>
  );
}
