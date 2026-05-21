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
import { DateInput } from "./date-field";

export type ICalendarProps<T extends DateValue> = AriaCalendarProps<T>;

export function Calendar<T extends DateValue>(props: ICalendarProps<T>) {
  return (
    <AriaCalendar {...props}>
      <header className="flex items-center justify-between pb-4 w-full">
        <RACButton
          slot="previous"
          className={cn(
            UI_RADIUS.control,
            "p-1.5 text-content/50 hover:text-content hover:bg-content/5 transition-colors outline-none cursor-pointer",
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </RACButton>
        <RACHeading className="font-semibold text-content/85 text-sm" />
        <RACButton
          slot="next"
          className={cn(
            UI_RADIUS.control,
            "p-1.5 text-content/50 hover:text-content hover:bg-content/5 transition-colors outline-none cursor-pointer",
          )}
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
              isToday,
              isHovered,
              isDisabled,
              isOutsideMonth,
            }) =>
              cn(
                "w-9 h-9 text-sm font-semibold flex items-center justify-center rounded-full transition-all outline-none cursor-pointer select-none",
                isToday && "border border-primary text-primary",
                isHovered && "bg-content/5 text-content",
                isSelected &&
                  "bg-primary text-white shadow-md shadow-primary/25 font-bold",
                isOutsideMonth && "text-content/20 font-normal",
                isDisabled && "opacity-30 cursor-not-allowed",
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
                className="flex-1 min-w-[120px] h-full"
              />
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
              className={cn(
                UI_RADIUS.modal,
                "z-50 origin-top-right bg-surface/95 border border-content/10 shadow-2xl backdrop-blur-md focus:outline-none p-4 animate-in fade-in zoom-in-95 duration-100",
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
