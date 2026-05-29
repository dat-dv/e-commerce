"use client";

import React from "react";
import { ListBoxItem as RACListBoxItem } from "react-aria-components";

import { cn } from "../../../utils";
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
          "group text-content flex w-full cursor-pointer items-center px-4 py-3 text-base font-normal transition-colors outline-none select-none",
          isFocused && "bg-primary/10 text-primary",
          isSelected && "bg-primary/5 text-primary font-semibold",
          isDisabled && "cursor-not-allowed opacity-50",
          className,
        )
      }
    >
      {children}
    </RACListBoxItem>
  );
}

export const ComboBoxItem = AppComboBoxItem;
