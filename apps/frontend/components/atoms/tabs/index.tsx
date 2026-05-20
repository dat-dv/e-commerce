"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
} from "react-aria-components";

export type { Key } from "react-aria-components";

export function Tabs({
  className,
  ...props
}: TabsProps & { className?: string }) {
  return (
    <RACTabs
      {...props}
      className={cn("flex flex-col gap-0 w-full", className)}
    />
  );
}

export function TabList<T extends object>({
  className,
  ...props
}: TabListProps<T> & { className?: string }) {
  return (
    <RACTabList
      {...props}
      className={cn(
        "flex flex-row items-end gap-1 border-b border-content/10",
        "overflow-x-auto overflow-y-clip hide-scrollbar",
        className,
      )}
    />
  );
}

export function Tab({
  className,
  children,
  ...props
}: TabProps & { className?: string }) {
  return (
    <RACTab
      {...props}
      className={({ isSelected, isDisabled, isFocusVisible }) =>
        cn(
          "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200",
          "cursor-pointer select-none outline-none whitespace-nowrap shrink-0",
          isSelected ? "text-primary" : "text-content/50 hover:text-content/80",
          isDisabled && "opacity-40 pointer-events-none",
          isFocusVisible && "rounded-t-lg ring-2 ring-primary/40 ring-offset-1",
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
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
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
}: TabPanelProps & { className?: string }) {
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
