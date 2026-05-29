"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
} from "react-aria-components";

import { cn } from "../../../utils";
import {
  ITabListProps,
  ITabPanelProps,
  ITabProps,
  ITabsProps,
} from "./tabs.types";

export type { Key } from "react-aria-components";

export function Tabs({
  className,
  ...props
}: ITabsProps & { className?: string }) {
  return (
    <RACTabs
      {...props}
      className={cn("flex w-full flex-col gap-0", className)}
    />
  );
}

export function TabList<T extends object>({
  className,
  ...props
}: ITabListProps<T> & { className?: string }) {
  return (
    <RACTabList
      {...props}
      className={cn(
        "border-content/10 flex flex-row items-end gap-1 border-b",
        "hide-scrollbar overflow-x-auto overflow-y-clip",
        className,
      )}
    />
  );
}

export function Tab({
  className,
  children,
  ...props
}: ITabProps & { className?: string }) {
  return (
    <RACTab
      {...props}
      className={({ isSelected, isDisabled, isFocusVisible }) =>
        cn(
          "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200",
          "shrink-0 cursor-pointer whitespace-nowrap outline-none select-none",
          isSelected ? "text-primary" : "text-content/50 hover:text-content/80",
          isDisabled && "pointer-events-none opacity-40",
          isFocusVisible && "ring-primary/40 rounded-t-lg ring-2 ring-offset-1",
          className,
        )
      }
    >
      {({ isSelected }) => (
        <>
          {children}
          {isSelected && (
            <motion.span
              layoutId="tab-indicator"
              className="bg-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
        </>
      )}
    </RACTab>
  );
}

export function TabPanel({
  className,
  id,
  children,
  ...props
}: ITabPanelProps & { className?: string }) {
  return (
    <RACTabPanel
      {...props}
      id={id}
      className={cn("mt-4 outline-none", className)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={String(id)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {children as React.ReactNode}
        </motion.div>
      </AnimatePresence>
    </RACTabPanel>
  );
}

Tabs.displayName = "Tabs";
TabList.displayName = "TabList";
Tab.displayName = "Tab";
TabPanel.displayName = "TabPanel";

export default Tabs;
