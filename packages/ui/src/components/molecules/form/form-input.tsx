"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import Input, { type IInputProps } from "../../atoms/input";

export interface IFormInputProps extends Omit<IInputProps, "id" | "error"> {
  name: string;
  maxCount?: number;
}

export const FormInput: React.FC<IFormInputProps> = ({
  name,
  maxCount,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input
          aria-label={rest.label || rest["aria-label"] || name}
          {...rest}
          {...field}
          id={name}
          error={error?.message}
          maxCount={maxCount}
        />
      )}
    />
  );
};
