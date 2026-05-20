"use client";

import { ReactNode } from "react";
import {
  Button as RACButton,
  Disclosure as RACDisclosure,
  DisclosurePanel as RACDisclosurePanel,
} from "react-aria-components";

import { cn } from "@/utils/cn";

export interface IAccordionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Accordion({
  title,
  children,
  className = "",
}: IAccordionProps) {
  return (
    <RACDisclosure
      className={cn(
        "border border-content/12 rounded-xl bg-surface hover:shadow-md transition-shadow",
        className,
      )}
    >
      {({ isExpanded }) => (
        <>
          <RACButton
            slot="trigger"
            className={({ isFocusVisible }) =>
              cn(
                "w-full px-6 py-[18px] text-base font-bold text-content outline-none select-none cursor-pointer flex justify-between items-center",
                isFocusVisible && "ring-2 ring-primary/50 rounded-t-xl",
              )
            }
          >
            <span className="hover:text-primary transition-colors text-left">
              {title}
            </span>
            <svg
              className={cn(
                "w-5 h-5 text-content/40 transition-transform duration-300",
                isExpanded ? "rotate-180" : "rotate-0",
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </RACButton>
          <RACDisclosurePanel
            className={cn(
              isExpanded &&
                "px-6 pb-6 text-content/60 text-sm animate-in fade-in duration-300 border-t border-content/5 pt-4 mt-2",
            )}
          >
            {children}
          </RACDisclosurePanel>
        </>
      )}
    </RACDisclosure>
  );
}
