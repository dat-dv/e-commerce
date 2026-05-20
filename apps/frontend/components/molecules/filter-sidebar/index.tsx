"use client";

import { ChevronDown } from "lucide-react";
import {
  Button as AriaButton,
  Disclosure,
  DisclosurePanel,
  Heading,
} from "react-aria-components";

import { cn } from "@/utils/cn";
import {
  IFilterSectionProps,
  IFilterSidebarProps,
} from "./filter-sidebar.types";

export function FilterSidebar({ children }: IFilterSidebarProps) {
  return (
    <aside className="h-fit rounded-2xl border border-content/[0.06] bg-surface/90 p-4 shadow-sm shadow-content/[0.02] backdrop-blur-md lg:top-28">
      <div className="flex flex-col gap-5">{children}</div>
    </aside>
  );
}

export function FilterSection({
  title,
  icon,
  children,
  defaultExpanded = true,
}: IFilterSectionProps) {
  return (
    <Disclosure defaultExpanded={defaultExpanded}>
      {({ isExpanded }) => (
        <section className="border-b border-content/[0.06] pb-5 last:border-b-0 last:pb-0">
          <Heading className="mb-3">
            <AriaButton
              slot="trigger"
              className="flex w-full items-center justify-between gap-3 rounded-xl py-1 text-left outline-none transition-colors hover:bg-content/[0.04] focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <span className="flex items-center gap-2">
                {icon}
                <span className="text-[14px] font-bold uppercase tracking-widest text-content/45">
                  {title}
                </span>
              </span>

              <ChevronDown
                className={cn(
                  "h-4 w-4 text-content/35 transition-transform",
                  isExpanded ? "rotate-180" : "rotate-0",
                )}
              />
            </AriaButton>
          </Heading>

          <DisclosurePanel className="space-y-4">{children}</DisclosurePanel>
        </section>
      )}
    </Disclosure>
  );
}
