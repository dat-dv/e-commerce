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
      className={cn("flex w-full flex-col gap-1.5 font-sans", className)}
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
            <RACSelectValue className="text-content empty:text-content/50 min-w-0 flex-1 truncate font-normal">
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
              "bg-surface/95 border-content/10 animate-in fade-in zoom-in-95 z-50 flex w-[var(--trigger-width)] origin-top-right flex-col overflow-hidden border shadow-2xl backdrop-blur-md duration-100 focus:outline-none",
            )}
            offset={4}
          >
            <Autocomplete filter={contains}>
              <RACSearchField
                autoFocus
                aria-label={searchPlaceholder}
                className={cn(
                  UI_RADIUS.control,
                  "border-content/[0.08] bg-content/[0.02] focus-within:ring-primary/20 focus-within:border-primary/50 m-2 flex items-center gap-2 border px-2.5 py-1.5 text-sm transition-all outline-none focus-within:ring-2",
                )}
              >
                <Search className="text-content/40 h-3.5 w-3.5 shrink-0" />
                <RACInput
                  placeholder={searchPlaceholder}
                  className="text-content placeholder-content/40 w-full border-none bg-transparent p-0 text-sm outline-none"
                />
              </RACSearchField>

              <RACListBox
                items={options}
                renderEmptyState={() => (
                  <div className="text-content/50 px-4 py-3 text-center text-sm italic">
                    {noResultsText}
                  </div>
                )}
                className="max-h-60 flex-1 overflow-y-auto py-1 outline-none"
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
                        "group text-content flex w-full cursor-pointer items-center px-4 py-3 text-base font-normal transition-colors outline-none select-none",
                        isFocused && "bg-primary/10 text-primary",
                        isSelected && "bg-primary/5 text-primary font-semibold",
                        itemDisabled && "cursor-not-allowed opacity-50",
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
