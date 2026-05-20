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
        "size-10 rounded-full p-0 text-content/60 transition-colors hover:bg-content/5 hover:text-content",
        className,
      )}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      title={title ?? ariaLabel}
    >
      <span className="relative block h-4 w-5" aria-hidden="true">
        <span
          className={cn(
            "absolute left-0 top-0.5 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out motion-reduce:transition-none",
            isOpen && "translate-y-[6px] rotate-45",
          )}
        />
        <span
          className={cn(
            "absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-all duration-200 ease-out motion-reduce:transition-none",
            isOpen && "scale-x-0 opacity-0",
          )}
        />
        <span
          className={cn(
            "absolute left-0 top-[13px] h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ease-out motion-reduce:transition-none",
            isOpen && "-translate-y-[6px] -rotate-45",
          )}
        />
      </span>
    </Button>
  );
}
