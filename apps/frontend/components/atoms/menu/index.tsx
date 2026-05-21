"use client";

import React from "react";
import {
  Button as RACButton,
  Menu as RACMenu,
  MenuItem as RACMenuItem,
  MenuTrigger as RACMenuTrigger,
  Popover as RACPopover,
  type MenuItemProps as RACMenuItemProps,
  type MenuTriggerProps as RACMenuTriggerProps,
} from "react-aria-components";

import { cn } from "@/utils/cn";

export interface IAppMenuProps extends Omit<RACMenuTriggerProps, "trigger"> {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isDisabled?: boolean;
  popoverClassName?: string;
  menuClassName?: string;
}

export function AppMenu({
  trigger,
  children,
  isDisabled,
  popoverClassName,
  menuClassName,
  ...props
}: IAppMenuProps) {
  return (
    <RACMenuTrigger {...props}>
      <RACButton
        isDisabled={isDisabled}
        className="inline-flex h-full w-full items-center justify-center border-none bg-transparent p-0 outline-none focus:outline-none"
      >
        {trigger}
      </RACButton>
      <RACPopover
        className={cn(
          "bg-surface/95 border-content/10 animate-in fade-in zoom-in-95 z-50 origin-top-right overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md duration-100 focus:outline-none",
          popoverClassName,
        )}
      >
        <RACMenu
          className={cn(
            "max-h-60 overflow-y-auto py-1 outline-none",
            menuClassName,
          )}
        >
          {children}
        </RACMenu>
      </RACPopover>
    </RACMenuTrigger>
  );
}

export interface IAppMenuItemProps extends RACMenuItemProps {
  className?: string;
}

export function AppMenuItem({
  children,
  className,
  ...props
}: IAppMenuItemProps) {
  return (
    <RACMenuItem
      {...props}
      className={({ isFocused, isSelected, isDisabled }) =>
        cn(
          "group text-content flex w-full cursor-pointer items-center px-4 py-2 text-sm font-normal transition-colors outline-none select-none",
          isFocused && "bg-primary/10 text-primary",
          isSelected && "bg-primary/5 text-primary font-semibold",
          isDisabled && "cursor-not-allowed opacity-50",
          className,
        )
      }
    >
      {children}
    </RACMenuItem>
  );
}

export const Menu = AppMenu;
export const MenuItem = AppMenuItem;
