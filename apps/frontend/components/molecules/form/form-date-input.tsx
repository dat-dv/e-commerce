"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { DateInput } from "@/components/atoms/input/date-input";
import { InputVariant } from "@/components/atoms/input/input.types";

interface FormDateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  variant?: InputVariant;
  maxDate?: Date;
  minDate?: Date;
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
      render={({ field, fieldState: { error } }) => {
        return (
          <DateInput
            {...field}
            {...rest}
            id={name}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            error={error?.message}
          />
        );
      }}
    />
  );
};
