"use client";

import { parseDate } from "@internationalized/date";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { DatePicker } from "../../atoms/date-picker";
import { InputSize, InputVariant } from "../../atoms/input";

export interface IFormDateInputProps {
  name: string;
  label?: string;
  variant?: InputVariant;
  maxDate?: Date;
  minDate?: Date;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  size?: InputSize;
}

const getCalendarDate = (val: unknown) => {
  if (!val) return undefined;
  try {
    if (val instanceof Date) {
      return parseDate(val.toISOString().split("T")[0]);
    }
    const str = String(val).split("T")[0];
    return parseDate(str);
  } catch {
    return undefined;
  }
};

export const FormDateInput = ({
  name,
  label,
  variant = "outline",
  maxDate,
  minDate,
  disabled,
  className,
  size,
}: IFormDateInputProps) => {
  const { control } = useFormContext();

  const maxValue = getCalendarDate(maxDate);
  const minValue = getCalendarDate(minDate);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = getCalendarDate(field.value);

        return (
          <DatePicker
            label={label}
            variant={variant}
            value={value || null}
            onChange={(date) => field.onChange(date ? date.toString() : "")}
            maxValue={maxValue}
            minValue={minValue}
            isDisabled={disabled}
            errorMessage={error?.message}
            className={className}
            size={size}
          />
        );
      }}
    />
  );
};

FormDateInput.displayName = "FormDateInput";
