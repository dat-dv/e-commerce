"use client";

import {
  DateField as AriaDateField,
  type DateFieldProps as AriaDateFieldProps,
  DateInput as AriaDateInput,
  type DateInputProps as AriaDateInputProps,
  type DateFieldRenderProps,
  type DateInputRenderProps,
  DateSegment,
  type DateValue,
  I18nProvider,
  FieldError as RACFieldError,
  Label as RACLabel,
  Text as RACText,
  useLocale,
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
import { cn } from "@/utils/cn";

export interface IDateInputProps extends Omit<
  AriaDateInputProps,
  "children" | "className"
> {
  variant?: InputVariant;
  size?: InputSize;
  className?: string | ((values: DateInputRenderProps) => string);
}

export function DateInput({
  variant = "outline",
  size = "lg",
  className,
  ...props
}: IDateInputProps) {
  return (
    <AriaDateInput
      {...props}
      className={(renderProps) =>
        cn(
          "flex w-full [scrollbar-width:none] items-center overflow-x-auto font-medium whitespace-nowrap transition-all [&::-webkit-scrollbar]:hidden",
          variantBase[variant],
          inputSizeClasses[size][variant],
          renderProps.isDisabled
            ? variantDisabled[variant]
            : renderProps.isInvalid
              ? variantError[variant]
              : renderProps.isFocusWithin
                ? variantActive[variant]
                : variantNormal[variant],
          typeof className === "function" ? className(renderProps) : className,
        )
      }
    >
      {(segment) => (
        <DateSegment
          segment={segment}
          className={({ isPlaceholder, isFocused, isDisabled }) =>
            cn(
              "text-content inline cursor-default rounded px-0.5 py-0.5 whitespace-nowrap outline-none select-none",
              segment.type === "literal" && "text-content/50 px-0",
              isPlaceholder && "text-content/30",
              isDisabled && "text-content/20 cursor-not-allowed",
              isFocused && "bg-primary rounded-md text-white",
            )
          }
        />
      )}
    </AriaDateInput>
  );
}

export interface IDateFieldProps<T extends DateValue> extends Omit<
  AriaDateFieldProps<T>,
  "className"
> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  variant?: InputVariant;
  size?: InputSize;
  className?: string | ((values: DateFieldRenderProps) => string);
}

export function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  variant = "outline",
  size = "lg",
  className,
  ...props
}: IDateFieldProps<T>) {
  const { locale } = useLocale();
  const dateLocale = locale === "en" ? "en-GB" : locale;

  return (
    <I18nProvider locale={dateLocale}>
      <AriaDateField
        {...props}
        className={(renderProps) =>
          cn(
            "flex w-full flex-col gap-1.5 font-sans",
            typeof className === "function"
              ? className(renderProps)
              : className,
          )
        }
      >
        {label && (
          <RACLabel className="text-content/80 ml-1 text-sm font-bold tracking-tight opacity-70">
            {label}
          </RACLabel>
        )}
        <DateInput variant={variant} size={size} />
        {description && (
          <RACText slot="description" className="text-content/65 ml-1 text-xs">
            {description}
          </RACText>
        )}
        <RACFieldError className="ml-1 text-xs font-medium text-red-500">
          {errorMessage}
        </RACFieldError>
      </AriaDateField>
    </I18nProvider>
  );
}
