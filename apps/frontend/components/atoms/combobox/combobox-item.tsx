"use client";

import React from "react";
import { ListBoxItem as RACListBoxItem } from "react-aria-components";

import { cn } from "@/utils/cn";
import { IComboBoxItemProps } from "./combobox.types";

export function AppComboBoxItem({
  children,
  className,
  ...props
}: IComboBoxItemProps) {
  return (
    <RACListBoxItem
      {...props}
      className={({ isFocused, isSelected, isDisabled }) =>
        cn(
          "group flex w-full items-center px-4 py-3 text-base font-normal transition-colors text-content outline-none cursor-pointer select-none",
          isFocused && "bg-primary/10 text-primary",
          isSelected && "bg-primary/5 text-primary font-semibold",
          isDisabled && "opacity-50 cursor-not-allowed",
          className,
        )
      }
    >
      {children}
    </RACListBoxItem>
  );
}

export const ComboBoxItem = AppComboBoxItem;
