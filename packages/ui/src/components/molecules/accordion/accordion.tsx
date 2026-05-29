"use client";

import { ReactNode } from "react";
import {
  Button as RACButton,
  Disclosure as RACDisclosure,
  DisclosurePanel as RACDisclosurePanel,
} from "react-aria-components";

import { cn } from "../../../utils";
import { type IAccordionProps } from "./accordion.types";

export interface IAccordionProps_old {
  title: string;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
}

export function Accordion({
  title,
  children,
  className = "",
  triggerClassName,
  panelClassName,
}: IAccordionProps) {
  return (
    <RACDisclosure
      className={cn(
        "border-content/12 bg-surface overflow-hidden rounded-xl border transition-shadow hover:shadow-md",
        className,
      )}
    >
      {({ isExpanded }) => (
        <>
          <RACButton
            slot="trigger"
            className={({ isFocusVisible }) =>
              cn(
                "bg-surface text-content flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-base font-bold outline-none select-none sm:px-6 sm:py-[18px]",
                isFocusVisible && "ring-primary/50 rounded-t-xl ring-2",
                triggerClassName,
              )
            }
          >
            <span className="hover:text-primary min-w-0 text-left transition-colors">
              {title}
            </span>
            <svg
              className={cn(
                "text-content/40 h-5 w-5 shrink-0 transition-transform duration-200",
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
              "bg-surface text-content/60 overflow-hidden text-sm leading-6",
              isExpanded
                ? "border-content/5 motion-safe:animate-in motion-safe:fade-in border-t px-5 pt-4 pb-5 motion-safe:duration-150 sm:px-6 sm:pb-6"
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

Accordion.displayName = "Accordion";
