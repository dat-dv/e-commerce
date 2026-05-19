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
          "w-full flex items-center transition-all font-medium whitespace-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
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
              "inline px-0.5 py-0.5 whitespace-nowrap rounded outline-none select-none text-content cursor-default",
              segment.type === "literal" && "px-0 text-content/50",
              isPlaceholder && "text-content/30",
              isDisabled && "text-content/20 cursor-not-allowed",
              isFocused && "bg-primary text-white rounded-md",
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
            "flex flex-col gap-1.5 w-full font-sans",
            typeof className === "function"
              ? className(renderProps)
              : className,
          )
        }
      >
        {label && (
          <RACLabel className="text-sm font-bold opacity-70 ml-1 tracking-tight text-content/80">
            {label}
          </RACLabel>
        )}
        <DateInput variant={variant} size={size} />
        {description && (
          <RACText slot="description" className="text-xs text-content/65 ml-1">
            {description}
          </RACText>
        )}
        <RACFieldError className="text-xs text-red-500 font-medium ml-1">
          {errorMessage}
        </RACFieldError>
      </AriaDateField>
    </I18nProvider>
  );
}
