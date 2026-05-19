"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  Button as RACButton,
  TreeItem as RACTreeItem,
  TreeItemContent as RACTreeItemContent,
} from "react-aria-components";

import { Checkbox } from "@/components/atoms/checkbox";
import { cn } from "@/utils/cn";
import { ITreeItemProps } from "./tree.types";

export function AppTreeItem({
  title,
  children,
  className,
  showDot,
  activeLayoutId,
  ...props
}: ITreeItemProps) {
  return (
    <RACTreeItem
      {...props}
      textValue={title}
      className={(renderProps) =>
        cn(
          "relative font-sans flex flex-col group gap-1 cursor-default select-none -outline-offset-2 transition-colors rounded-lg",
          typeof className === "function" ? className(renderProps) : className,
        )
      }
    >
      <RACTreeItemContent>
        {({
          selectionMode,
          selectionBehavior,
          hasChildItems,
          isExpanded,
          isDisabled,
          isSelected,
          isFocused,
        }) => (
          <div
            className={cn(
              "relative flex items-center w-full py-2 px-3 rounded-xl text-sm text-content transition-colors min-h-10",
              !isSelected && "hover:bg-content/[0.04]",
              isSelected &&
                !activeLayoutId &&
                "bg-primary/10 text-primary font-semibold",
              isSelected && activeLayoutId && "text-primary font-semibold",
              isDisabled && "text-content/30 opacity-50 z-10",
              isFocused && "outline-none ring-2 ring-primary/20",
            )}
          >
            {isSelected && activeLayoutId && (
              <motion.div
                layoutId={activeLayoutId}
                className="absolute inset-0 rounded-xl bg-primary/10"
                transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
              />
            )}

            {selectionMode !== "none" && selectionBehavior === "toggle" && (
              <Checkbox slot="selection" className="mr-2 relative z-10" />
            )}
            <div className="shrink-0 w-[calc(calc(var(--tree-item-level)_-_1)_*_10px)] relative z-10" />

            {hasChildItems ? (
              <RACButton
                slot="chevron"
                className={cn(
                  "relative z-10 border-0 p-0 bg-transparent shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-start cursor-pointer hover:bg-content/[0.04] transition-colors outline-none mr-1",
                  isDisabled && "text-content/30 opacity-50 cursor-not-allowed",
                )}
              >
                <ChevronRight
                  aria-hidden
                  className={cn(
                    "w-4 h-4 text-content/50 transition-transform duration-200 ease-in-out",
                    isExpanded && "rotate-90",
                    isDisabled && "text-content/30",
                  )}
                />
              </RACButton>
            ) : (
              <div className="shrink-0 w-7 h-7 relative z-10 flex items-center justify-center">
                {showDot && (
                  <span
                    className={cn(
                      "size-1.5 rounded-full transition-opacity",
                      isSelected
                        ? "bg-primary opacity-100"
                        : "bg-content/20 opacity-0 group-hover:opacity-100",
                    )}
                  />
                )}
              </div>
            )}
            <span className="relative z-10 truncate capitalize font-semibold">
              {title}
            </span>
          </div>
        )}
      </RACTreeItemContent>
      {children}
    </RACTreeItem>
  );
}

export const TreeItem = AppTreeItem;
