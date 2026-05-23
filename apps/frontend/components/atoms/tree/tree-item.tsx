"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import {
  Button as RACButton,
  TreeItem as RACTreeItem,
  TreeItemContent as RACTreeItemContent,
} from "react-aria-components";

import { Checkbox } from "@/components/atoms/checkbox";
import LiquidWaveText from "@/components/atoms/liquid-wave-text";
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
          "group relative flex cursor-default flex-col gap-1 rounded-lg font-sans -outline-offset-2 transition-colors select-none",
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
              "text-content relative flex min-h-10 w-full items-center rounded-xl px-3 py-2 text-sm transition-colors",
              !isSelected && "hover:bg-content/[0.04]",
              isSelected &&
                !activeLayoutId &&
                "bg-primary/10 text-primary font-semibold",
              isSelected && activeLayoutId && "text-primary font-semibold",
              isDisabled && "text-content/30 z-10 opacity-50",
              isFocused && "ring-primary/20 ring-2 outline-none",
            )}
          >
            {isSelected && activeLayoutId && (
              <motion.div
                layoutId={activeLayoutId}
                className="bg-primary/10 absolute inset-0 rounded-xl"
                transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
              />
            )}

            {selectionMode !== "none" && selectionBehavior === "toggle" && (
              <Checkbox
                slot="selection"
                className="relative z-10 mr-2"
                aria-label={
                  typeof title === "string" ? `Select ${title}` : "Select item"
                }
              />
            )}
            <div className="relative z-10 w-[calc(calc(var(--tree-item-level)_-_1)_*_10px)] shrink-0" />

            {hasChildItems ? (
              <RACButton
                slot="chevron"
                className={cn(
                  "hover:bg-content/[0.04] relative z-10 mr-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-start transition-colors outline-none",
                  isDisabled && "text-content/30 cursor-not-allowed opacity-50",
                )}
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                <ChevronRight
                  aria-hidden
                  className={cn(
                    "text-content/50 h-4 w-4 transition-transform duration-200 ease-in-out",
                    isExpanded && "rotate-90",
                    isDisabled && "text-content/30",
                  )}
                />
              </RACButton>
            ) : (
              <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center">
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
            <LiquidWaveText
              isActive={isSelected}
              className="relative z-10 min-w-0 truncate font-semibold capitalize"
              inactiveClassName="text-content"
            >
              {title}
            </LiquidWaveText>
          </div>
        )}
      </RACTreeItemContent>
      {children}
    </RACTreeItem>
  );
}

export const TreeItem = AppTreeItem;
