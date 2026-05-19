"use client";

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
              "flex items-center w-full py-1.5 px-3 rounded-lg text-sm text-content transition-colors",
              !isSelected && "hover:bg-content/[0.04]",
              isSelected && "bg-primary/10 text-primary font-semibold",
              isDisabled && "text-content/30 opacity-50 z-10",
              isFocused && "outline-none ring-2 ring-primary/20",
            )}
          >
            {selectionMode !== "none" && selectionBehavior === "toggle" && (
              <Checkbox slot="selection" className="mr-2" />
            )}
            <div className="shrink-0 w-[calc(calc(var(--tree-item-level)_-_1)_*_12px)]" />
            {hasChildItems ? (
              <RACButton
                slot="chevron"
                className={cn(
                  "border-0 p-0 bg-transparent shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-start cursor-pointer hover:bg-content/[0.04] transition-colors outline-none mr-1",
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
              <div className="shrink-0 w-7 h-7" />
            )}
            <span className="truncate">{title}</span>
          </div>
        )}
      </RACTreeItemContent>
      {children}
    </RACTreeItem>
  );
}

export const TreeItem = AppTreeItem;
