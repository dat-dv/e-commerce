"use client";

import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Button as RACButton,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateRangePickerRenderProps,
  type DateValue,
  FieldError as RACFieldError,
  Group as RACGroup,
  Heading as RACHeading,
  Label as RACLabel,
  Popover as RACPopover,
  RangeCalendar as AriaRangeCalendar,
  type RangeCalendarProps as AriaRangeCalendarProps,
  Text as RACText,
  type ValidationResult,
} from "react-aria-components";

import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { InputSize, inputSizeClasses } from "../input/input.sizes";
import {
  variantActive,
  variantBase,
  variantDisabled,
  variantError,
  variantNormal,
} from "../input/input.styles";
import { InputVariant } from "../input/input.types";
import { DateInput } from "./date-field";

export type IRangeCalendarProps<T extends DateValue> =
  AriaRangeCalendarProps<T>;

export function RangeCalendar<T extends DateValue>(
  props: IRangeCalendarProps<T>,
) {
  return (
    <AriaRangeCalendar {...props}>
      <header className="flex w-full items-center justify-between pb-4">
        <RACButton
          slot="previous"
          className={cn(
            UI_RADIUS.control,
            "text-content/50 hover:text-content hover:bg-content/5 cursor-pointer p-1.5 transition-colors outline-none",
          )}
          aria-label="Previous Month"
        >
          <ChevronLeft className="h-5 w-5" />
        </RACButton>
        <RACHeading className="text-content/85 text-sm font-semibold" />
        <RACButton
          slot="next"
          className={cn(
            UI_RADIUS.control,
            "text-content/50 hover:text-content hover:bg-content/5 cursor-pointer p-1.5 transition-colors outline-none",
          )}
          aria-label="Next Month"
        >
          <ChevronRight className="h-5 w-5" />
        </RACButton>
      </header>
      <AriaCalendarGrid className="border-collapse">
        {(date) => (
          <AriaCalendarCell
            date={date}
            className={({
              isSelected,
              isSelectionStart,
              isSelectionEnd,
              isToday,
              isHovered,
              isDisabled,
              isOutsideMonth,
            }) =>
              cn(
                "flex h-9 w-9 cursor-pointer items-center justify-center text-sm font-semibold transition-all outline-none select-none",
                isToday && "border-primary text-primary border",
                isHovered && "bg-content/5 text-content rounded-full",
                isSelected &&
                  !isSelectionStart &&
                  !isSelectionEnd &&
                  "bg-primary/10 text-primary rounded-none font-bold",
                isSelected &&
                  isSelectionStart &&
                  "bg-primary shadow-primary/25 rounded-l-full font-bold text-white shadow-md",
                isSelected &&
                  isSelectionEnd &&
                  "bg-primary shadow-primary/25 rounded-r-full font-bold text-white shadow-md",
                isOutsideMonth && "text-content/20 font-normal",
                isDisabled && "cursor-not-allowed opacity-30",
              )
            }
          />
        )}
      </AriaCalendarGrid>
    </AriaRangeCalendar>
  );
}

export interface IDateRangePickerProps<T extends DateValue> extends Omit<
  AriaDateRangePickerProps<T>,
  "className"
> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  variant?: InputVariant;
  size?: InputSize;
  className?: string | ((values: DateRangePickerRenderProps) => string);
}

export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  variant = "outline",
  size = "lg",
  className,
  ...props
}: IDateRangePickerProps<T>) {
  return (
    <AriaDateRangePicker
      {...props}
      className={(renderProps) =>
        cn(
          "group flex w-full flex-col gap-1.5 font-sans",
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
          <RACGroup
            className={cn(
              "relative flex w-full items-center justify-between pr-4 font-medium transition-all",
              variantBase[variant],
              inputSizeClasses[size][variant],
              isDisabled
                ? variantDisabled[variant]
                : isInvalid
                  ? variantError[variant]
                  : isOpen
                    ? variantActive[variant]
                    : variantNormal[variant],
            )}
          >
            <div className="flex flex-1 [scrollbar-width:none] items-center overflow-x-auto [&::-webkit-scrollbar]:hidden">
              <DateInput
                slot="start"
                variant="none"
                size={size}
                className="min-w-[110px]"
              />
              <span aria-hidden="true" className="text-content/40 px-1">
                –
              </span>
              <DateInput
                slot="end"
                variant="none"
                size={size}
                className="min-w-[110px]"
              />
            </div>
            <RACButton
              className="text-content/40 hover:text-content ml-2 cursor-pointer p-1 transition-colors outline-none"
              aria-label="Open calendar picker"
            >
              <CalendarIcon className="h-5 w-5" />
            </RACButton>
          </RACGroup>
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
              UI_RADIUS.modal,
              "bg-surface/95 border-content/10 animate-in fade-in zoom-in-95 z-50 origin-top-right border p-4 shadow-2xl backdrop-blur-md duration-100 focus:outline-none",
            )}
            offset={4}
            placement="bottom end"
          >
            <RangeCalendar />
          </RACPopover>
        </>
      )}
    </AriaDateRangePicker>
  );
}
