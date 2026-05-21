"use client";

import { ChevronDown, Search } from "lucide-react";
import {
  Button as RACButton,
  FieldError as RACFieldError,
  Input as RACInput,
  Label as RACLabel,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  Popover as RACPopover,
  SearchField as RACSearchField,
  Select as RACSelect,
  SelectValue as RACSelectValue,
  Text as RACText,
  type SelectProps as RACSelectProps,
} from "react-aria-components";
import { Autocomplete, useFilter } from "react-aria-components/Autocomplete";

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

export interface ISelectAutocompleteOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ISelectAutocompleteProps<T extends object> extends Omit<
  RACSelectProps<T>,
  "children" | "className"
> {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  description?: string;
  errorMessage?: string;
  variant?: InputVariant;
  size?: InputSize;
  className?: string;
  options: ISelectAutocompleteOption[];
  noResultsText?: string;
}

export function AppSelectAutocompleteClient<T extends object>({
  label,
  placeholder,
  searchPlaceholder = "Search...",
  description,
  errorMessage,
  variant = "outline",
  size = "lg",
  className,
  options,
  noResultsText = "No results.",
  ...props
}: ISelectAutocompleteProps<T>) {
  const { contains } = useFilter({ sensitivity: "base" });

  return (
    <RACSelect
      {...props}
      className={cn("flex flex-col gap-1.5 w-full font-sans", className)}
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
              "z-50 w-[var(--trigger-width)] origin-top-right bg-surface/95 border border-content/10 shadow-2xl backdrop-blur-md focus:outline-none overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col",
            )}
            offset={4}
          >
            <Autocomplete filter={contains}>
              <RACSearchField
                autoFocus
                aria-label={searchPlaceholder}
                className={cn(
                  UI_RADIUS.control,
                  "flex items-center gap-2 border border-content/[0.08] bg-content/[0.02] px-2.5 py-1.5 text-sm outline-none m-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all",
                )}
              >
                <Search className="w-3.5 h-3.5 text-content/40 shrink-0" />
                <RACInput
                  placeholder={searchPlaceholder}
                  className="bg-transparent border-none outline-none w-full text-content text-sm placeholder-content/40 p-0"
                />
              </RACSearchField>

              <RACListBox
                items={options}
                renderEmptyState={() => (
                  <div className="px-4 py-3 text-sm text-content/50 italic text-center">
                    {noResultsText}
                  </div>
                )}
                className="outline-none py-1 max-h-60 overflow-y-auto flex-1"
              >
                {(opt) => (
                  <RACListBoxItem
                    key={opt.value}
                    id={opt.value}
                    textValue={opt.label}
                    isDisabled={opt.disabled}
                    className={({
                      isFocused,
                      isSelected,
                      isDisabled: itemDisabled,
                    }) =>
                      cn(
                        "group flex w-full items-center px-4 py-3 text-base font-normal transition-colors text-content outline-none cursor-pointer select-none",
                        isFocused && "bg-primary/10 text-primary",
                        isSelected && "bg-primary/5 text-primary font-semibold",
                        itemDisabled && "opacity-50 cursor-not-allowed",
                      )
                    }
                  >
                    {opt.label}
                  </RACListBoxItem>
                )}
              </RACListBox>
            </Autocomplete>
          </RACPopover>
        </>
      )}
    </RACSelect>
  );
}

export const SelectAutocomplete = AppSelectAutocompleteClient;
