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
  type SelectProps as RACSelectProps,
  type SelectRenderProps,
  type ValidationResult,
} from "react-aria-components";

import {
  InputSize,
  inputSizeClasses,
} from "@/components/atoms/input/input.sizes";
import {
  variantActive,
  variantBase,
  variantDisabled,
  variantError,
  variantNormal,
} from "@/components/atoms/input/input.styles";
import { InputVariant } from "@/components/atoms/input/input.types";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";

export interface ISelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ISelectProps<T extends object> extends Omit<
  RACSelectProps<T>,
  "children" | "className"
> {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  variant?: InputVariant;
  size?: InputSize;
  className?: string | ((values: SelectRenderProps) => string);
  itemClassName?: string;
  options?: ISelectOption[];
  children?: React.ReactNode | ((item: T) => React.ReactNode);
}

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
          "flex flex-col gap-1.5 w-full font-sans",
          typeof className === "function" ? className(renderProps) : className,
        )
      }
    >
      {({ isOpen, isInvalid, isDisabled }) => (
        <>
          {label && (
            <RACLabel className="text-sm font-bold opacity-70 ml-1 tracking-tight text-content/80">
              {label}
            </RACLabel>
          )}

          <RACButton
            className={({ isFocusVisible }) =>
              cn(
                "w-full flex justify-between items-center transition-all font-medium outline-none select-none cursor-pointer text-left",
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
                isFocusVisible && "ring-2 ring-primary/50",
              )
            }
          >
            <RACSelectValue className="text-content font-normal empty:text-content/50">
              {({ selectedText }) => selectedText || placeholder}
            </RACSelectValue>
            <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0 text-content" />
          </RACButton>

          {description && (
            <RACText
              slot="description"
              className="text-xs text-content/65 ml-1"
            >
              {description}
            </RACText>
          )}

          <RACFieldError className="text-xs text-red-500 font-medium ml-1">
            {errorMessage}
          </RACFieldError>

          <RACPopover
            className={cn(
              UI_RADIUS.popover,
              "z-50 w-[var(--trigger-width)] origin-top-right bg-surface/95 border border-content/10 shadow-2xl backdrop-blur-md focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-100",
            )}
            offset={4}
          >
            <RACListBox className="outline-none py-1 max-h-60 overflow-y-auto">
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
                          "group flex w-full items-center px-4 py-3 text-base font-normal transition-colors text-content outline-none cursor-pointer select-none",
                          itemClassName,
                          isFocused && "bg-primary/10 text-primary",
                          isSelected &&
                            "bg-primary/5 text-primary font-semibold",
                          itemDisabled && "opacity-50 cursor-not-allowed",
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

export const Select = AppSelect;
