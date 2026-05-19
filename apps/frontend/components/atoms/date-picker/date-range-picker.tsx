"use client";

import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  DateRangePicker as AriaDateRangePicker,
  RangeCalendar as AriaRangeCalendar,
  Button as RACButton,
  FieldError as RACFieldError,
  Heading as RACHeading,
  Label as RACLabel,
  Popover as RACPopover,
  Text as RACText,
  Group as RACGroup,
  I18nProvider,
  useLocale,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type RangeCalendarProps as AriaRangeCalendarProps,
  type DateRangePickerRenderProps,
  type DateValue,
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
import { DateInput } from "./date-field";

export type IRangeCalendarProps<T extends DateValue> =
  AriaRangeCalendarProps<T>;

export function RangeCalendar<T extends DateValue>(
  props: IRangeCalendarProps<T>,
) {
  return (
    <AriaRangeCalendar {...props}>
      <header className="flex items-center justify-between pb-4 w-full">
        <RACButton
          slot="previous"
          className="p-1.5 text-content/50 hover:text-content hover:bg-content/5 rounded-lg transition-colors outline-none cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </RACButton>
        <RACHeading className="font-semibold text-content/85 text-sm" />
        <RACButton
          slot="next"
          className="p-1.5 text-content/50 hover:text-content hover:bg-content/5 rounded-lg transition-colors outline-none cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
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
                "w-9 h-9 text-sm font-semibold flex items-center justify-center transition-all outline-none cursor-pointer select-none",
                isToday && "border border-primary text-primary",
                isHovered && "bg-content/5 text-content rounded-full",
                isSelected &&
                  !isSelectionStart &&
                  !isSelectionEnd &&
                  "bg-primary/10 text-primary font-bold rounded-none",
                isSelected &&
                  isSelectionStart &&
                  "bg-primary text-white shadow-md shadow-primary/25 font-bold rounded-l-full",
                isSelected &&
                  isSelectionEnd &&
                  "bg-primary text-white shadow-md shadow-primary/25 font-bold rounded-r-full",
                isOutsideMonth && "text-content/20 font-normal",
                isDisabled && "opacity-30 cursor-not-allowed",
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
  className?: string | ((values: DateRangePickerRenderProps) => string);
}

export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  variant = "outline",
  className,
  ...props
}: IDateRangePickerProps<T>) {
  const { locale } = useLocale();
  const dateLocale = locale === "en" ? "en-GB" : locale;

  return (
    <I18nProvider locale={dateLocale}>
      <AriaDateRangePicker
        {...props}
        className={(renderProps) =>
          cn(
            "group flex flex-col gap-1.5 w-full font-sans",
            typeof className === "function"
              ? className(renderProps)
              : className,
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
            <RACGroup
              className={cn(
                "w-full flex justify-between items-center transition-all font-medium pr-4 relative",
                variantBase[variant],
                isDisabled
                  ? variantDisabled[variant]
                  : isInvalid
                    ? variantError[variant]
                    : isOpen
                      ? variantActive[variant]
                      : variantNormal[variant],
              )}
            >
              <div className="flex-1 flex items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <DateInput
                  slot="start"
                  variant="none"
                  className="min-w-[110px]"
                />
                <span aria-hidden="true" className="text-content/40 px-1">
                  –
                </span>
                <DateInput
                  slot="end"
                  variant="none"
                  className="min-w-[110px]"
                />
              </div>
              <RACButton className="ml-2 p-1 text-content/40 hover:text-content transition-colors outline-none cursor-pointer">
                <CalendarIcon className="w-5 h-5" />
              </RACButton>
            </RACGroup>
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
              className="z-50 origin-top-right rounded-2xl bg-surface/95 border border-content/10 shadow-2xl backdrop-blur-md focus:outline-none p-4 animate-in fade-in zoom-in-95 duration-100"
              offset={4}
              placement="bottom end"
            >
              <RangeCalendar />
            </RACPopover>
          </>
        )}
      </AriaDateRangePicker>
    </I18nProvider>
  );
}
