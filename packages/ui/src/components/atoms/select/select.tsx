"use client";

import { ChevronDown } from "lucide-react";
import React from "react";
import {
  Button as RACButton,
  FieldError as RACFieldError,
  Label as RACLabel,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  Popover as RACPopover,
  Select as RACSelect,
  SelectValue as RACSelectValue,
  Text as RACText,
} from "react-aria-components";

import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { inputSizeClasses } from "../input/input.sizes";
import {
  variantActive,
  variantBase,
  variantDisabled,
  variantError,
  variantNormal,
} from "../input/input.styles";
import { ISelectProps } from "./select.types";

export function AppSelect<T extends object>({
  label,
  placeholder,
  description,
  errorMessage,
  variant = "outline",
  size = "lg",
  className,
  itemClassName,
  options,
  children,
  ...props
}: ISelectProps<T>) {
  return (
    <RACSelect
      {...props}
      className={(renderProps) =>
        cn(
          "flex w-full flex-col gap-1.5 font-sans",
          typeof className === "function" ? className(renderProps) : className,
        )
      }
    >
      {({ isOpen, isInvalid, isDisabled }) => (
        <>
          {label && (
            <RACLabel className="text-content/80 ml-1 text-sm font-bold tracking-tight opacity-70">
              {label}
            </RACLabel>
          )}

          <RACButton
            className={({ isFocusVisible }) =>
              cn(
                "flex w-full cursor-pointer items-center justify-between text-left font-medium transition-all outline-none select-none",
                variantBase[variant],
                inputSizeClasses[size][variant],
                variant === "outline" && UI_RADIUS.input,
                isDisabled
                  ? variantDisabled[variant]
                  : isInvalid
                    ? variantError[variant]
                    : isOpen
                      ? variantActive[variant]
                      : variantNormal[variant],
                isFocusVisible && "ring-primary/50 ring-2",
              )
            }
          >
            <RACSelectValue className="text-content empty:text-content/50 font-normal">
              {({ selectedText }) => selectedText || placeholder}
            </RACSelectValue>
            <ChevronDown className="text-content ml-2 h-4 w-4 shrink-0 opacity-50" />
          </RACButton>

          {description && (
            <RACText
              slot="description"
              className="text-content/65 ml-1 text-xs"
            >
              {description}
            </RACText>
          )}

          <RACFieldError className="ml-1 text-xs font-medium text-red-500">
            {errorMessage}
          </RACFieldError>

          <RACPopover
            className={cn(
              UI_RADIUS.popover,
              "bg-surface/95 border-content/10 animate-in fade-in zoom-in-95 z-50 w-[var(--trigger-width)] origin-top-right overflow-hidden border shadow-2xl backdrop-blur-md duration-100 focus:outline-none",
            )}
            offset={4}
          >
            <RACListBox className="max-h-60 overflow-y-auto py-1 outline-none">
              {options && !children
                ? options.map((opt) => (
                    <RACListBoxItem
                      key={opt.value}
                      id={opt.value}
                      isDisabled={opt.disabled}
                      className={({
                        isFocused,
                        isSelected,
                        isDisabled: itemDisabled,
                      }) =>
                        cn(
                          "group text-content flex w-full cursor-pointer items-center px-4 py-3 text-base font-normal transition-colors outline-none select-none",
                          itemClassName,
                          isFocused && "bg-primary/10 text-primary",
                          isSelected &&
                            "bg-primary/5 text-primary font-semibold",
                          itemDisabled && "cursor-not-allowed opacity-50",
                        )
                      }
                    >
                      {opt.label}
                    </RACListBoxItem>
                  ))
                : (children as React.ReactNode)}
            </RACListBox>
          </RACPopover>
        </>
      )}
    </RACSelect>
  );
}

AppSelect.displayName = "AppSelect";

export const Select = AppSelect;
Select.displayName = "Select";

export default AppSelect;
