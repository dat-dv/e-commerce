"use client";

import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Calendar as AriaCalendar,
  CalendarCell as AriaCalendarCell,
  CalendarGrid as AriaCalendarGrid,
  DatePicker as AriaDatePicker,
  I18nProvider,
  Button as RACButton,
  FieldError as RACFieldError,
  Group as RACGroup,
  Heading as RACHeading,
  Label as RACLabel,
  Popover as RACPopover,
  Text as RACText,
  useLocale,
  type CalendarProps as AriaCalendarProps,
  type DatePickerProps as AriaDatePickerProps,
  type DatePickerRenderProps,
  type DateValue,
  type ValidationResult,
} from "react-aria-components";

import {
  InputSize,
  inputSizeClasses,
} from "../input/input.sizes";
import {
  variantActive,
  variantBase,
  variantDisabled,
  variantError,
  variantNormal,
} from "../input/input.styles";
import { InputVariant } from "../input/input.types";
import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { DateInput } from "./date-field";

export type ICalendarProps<T extends DateValue> = AriaCalendarProps<T>;

export function Calendar<T extends DateValue>(props: ICalendarProps<T>) {
  return (
    <AriaCalendar {...props}>
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
              isToday,
              isHovered,
              isDisabled,
              isOutsideMonth,
            }) =>
              cn(
                "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition-all outline-none select-none",
                isToday && "border-primary text-primary border",
                isHovered && "bg-content/5 text-content",
                isSelected &&
                  "bg-primary shadow-primary/25 font-bold text-white shadow-md",
                isOutsideMonth && "text-content/20 font-normal",
                isDisabled && "cursor-not-allowed opacity-30",
              )
            }
          />
        )}
      </AriaCalendarGrid>
    </AriaCalendar>
  );
}

export interface IDatePickerProps<T extends DateValue> extends Omit<
  AriaDatePickerProps<T>,
  "className"
> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  variant?: InputVariant;
  size?: InputSize;
  className?: string | ((values: DatePickerRenderProps) => string);
}

export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  variant = "outline",
  size = "lg",
  className,
  ...props
}: IDatePickerProps<T>) {
  const { locale } = useLocale();
  const dateLocale = locale === "en" ? "en-GB" : locale;

  return (
    <I18nProvider locale={dateLocale}>
      <AriaDatePicker
        {...props}
        className={(renderProps) =>
          cn(
            "group flex w-full flex-col gap-1.5 font-sans",
            typeof className === "function"
              ? className(renderProps)
              : className,
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
              <DateInput
                variant="none"
                size={size}
                className="h-full min-w-[120px] flex-1"
              />
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
              <Calendar />
            </RACPopover>
          </>
        )}
      </AriaDatePicker>
    </I18nProvider>
  );
}
