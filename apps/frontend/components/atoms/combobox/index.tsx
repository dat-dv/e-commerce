"use client";

import { ChevronDown } from "lucide-react";
import React from "react";
import {
  Button as RACButton,
  ComboBox as RACComboBox,
  FieldError as RACFieldError,
  Input as RACInput,
  Label as RACLabel,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  Popover as RACPopover,
  Text as RACText,
  type ComboBoxRenderProps,
  type ComboBoxProps as RACComboBoxProps,
  type ValidationResult,
} from "react-aria-components";

import {
  variantActive,
  variantBase,
  variantDisabled,
  variantError,
  variantNormal,
} from "@/components/atoms/input/input.styles";
import { InputVariant } from "@/components/atoms/input/input.types";
import { cn } from "@/utils/cn";

export interface IComboBoxOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface IComboBoxProps<T extends object> extends Omit<
  RACComboBoxProps<T>,
  "children" | "className"
> {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  variant?: InputVariant;
  className?: string | ((values: ComboBoxRenderProps) => string);
  options?: IComboBoxOption[];
  children?: React.ReactNode | ((item: T) => React.ReactNode);
}

export function AppComboBox<T extends object>({
  label,
  placeholder,
  description,
  errorMessage,
  variant = "outline",
  className,
  options,
  children,
  ...props
}: IComboBoxProps<T>) {
  return (
    <RACComboBox
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

          <div className="relative w-full">
            <RACInput
              placeholder={placeholder}
              className={({ isFocusVisible }) =>
                cn(
                  "w-full pr-10 transition-all font-medium outline-none select-none text-left bg-transparent",
                  variantBase[variant],
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
            />
            <RACButton className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-content/40 hover:text-content transition-colors outline-none cursor-pointer">
              <ChevronDown className="w-4 h-4" />
            </RACButton>
          </div>

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
            className="z-50 w-[var(--trigger-width)] origin-top-right rounded-xl bg-surface/95 border border-content/10 shadow-2xl backdrop-blur-md focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-100"
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
    </RACComboBox>
  );
}

export const ComboBox = AppComboBox;
