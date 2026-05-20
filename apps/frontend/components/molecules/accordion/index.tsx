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
  triggerClassName?: string;
  panelClassName?: string;
}

export default function Accordion({
  title,
  children,
  className = "",
  triggerClassName,
  panelClassName,
}: IAccordionProps) {
  return (
    <RACDisclosure
      className={cn(
        "overflow-hidden rounded-xl border border-content/12 bg-surface transition-shadow hover:shadow-md",
        className,
      )}
    >
      {({ isExpanded }) => (
        <>
          <RACButton
            slot="trigger"
            className={({ isFocusVisible }) =>
              cn(
                "flex w-full cursor-pointer select-none items-center justify-between gap-4 bg-surface px-5 py-4 text-base font-bold text-content outline-none sm:px-6 sm:py-[18px]",
                isFocusVisible && "rounded-t-xl ring-2 ring-primary/50",
                triggerClassName,
              )
            }
          >
            <span className="min-w-0 text-left transition-colors hover:text-primary">
              {title}
            </span>
            <svg
              className={cn(
                "h-5 w-5 shrink-0 text-content/40 transition-transform duration-200",
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
              "overflow-hidden bg-surface text-sm leading-6 text-content/60",
              isExpanded
                ? "border-t border-content/5 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-150"
                : "hidden h-0 border-0 p-0",
              panelClassName,
            )}
          >
            {children}
          </RACDisclosurePanel>
        </>
      )}
    </RACDisclosure>
  );
}
