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
        className="outline-none focus:outline-none bg-transparent p-0 border-none inline-flex items-center justify-center h-full w-full"
      >
        {trigger}
      </RACButton>
      <RACPopover
        className={cn(
          "z-50 origin-top-right rounded-xl bg-surface/95 border border-content/10 shadow-2xl backdrop-blur-md focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-100",
          popoverClassName,
        )}
      >
        <RACMenu
          className={cn(
            "outline-none py-1 max-h-60 overflow-y-auto",
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
          "group flex w-full items-center px-4 py-2 text-sm font-normal transition-colors text-content outline-none cursor-pointer select-none",
          isFocused && "bg-primary/10 text-primary",
          isSelected && "bg-primary/5 text-primary font-semibold",
          isDisabled && "opacity-50 cursor-not-allowed",
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
