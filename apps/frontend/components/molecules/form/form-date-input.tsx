"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { DateInput } from "@/components/atoms/input/date-input";
import { InputVariant } from "@/components/atoms/input/input.types";
import { fromPickerFormat, toPickerFormat } from "@/utils/date-format";

interface FormDateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  variant?: InputVariant;
}

export const FormDateInput: React.FC<FormDateInputProps> = ({
  name,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DateInput
          {...field}
          {...rest}
          id={name}
          value={toPickerFormat(field.value)}
          onChange={(e) => field.onChange(fromPickerFormat(e.target.value))}
          error={error?.message}
        />
      )}
    />
  );
};
