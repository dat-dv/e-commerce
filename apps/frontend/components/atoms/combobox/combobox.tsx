"use client";

import { ChevronDown } from "lucide-react";
import React from "react";
import {
  Button as RACButton,
  ComboBox as RACComboBox,
  ComboBoxValue as RACComboBoxValue,
  FieldError as RACFieldError,
  Input as RACInput,
  Label as RACLabel,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  Popover as RACPopover,
  Text as RACText,
} from "react-aria-components";

import { inputSizeClasses } from "@/components/atoms/input/input.sizes";
import {
  variantActive,
  variantBase,
  variantDisabled,
  variantError,
  variantNormal,
} from "@/components/atoms/input/input.styles";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { IComboBoxProps } from "./combobox.types";

export function AppComboBox<
  T extends object,
  M extends "single" | "multiple" = "single",
>({
  label,
  placeholder,
  description,
  errorMessage,
  variant = "outline",
  size = "lg",
  className,
  options,
  children,
  multipleValuePlaceholder = "No items selected",
  ...props
}: IComboBoxProps<T, M>) {
  return (
    <RACComboBox
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

          <div className="relative w-full">
            <RACInput
              placeholder={placeholder}
              className={({ isFocusVisible }) =>
                cn(
                  "w-full bg-transparent pr-10 text-left font-medium transition-all outline-none select-none",
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
            />
            <RACButton className="text-content/40 hover:text-content absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 transition-colors outline-none">
              <ChevronDown className="h-4 w-4" />
            </RACButton>
          </div>

          {props.selectionMode === "multiple" && (
            <RACComboBoxValue
              placeholder={multipleValuePlaceholder}
              className="text-content/60 mt-1 ml-1 text-xs"
            />
          )}

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
    </RACComboBox>
  );
}

export const ComboBox = AppComboBox;
