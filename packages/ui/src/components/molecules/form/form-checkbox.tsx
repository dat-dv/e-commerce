"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Checkbox, ICheckboxProps } from "@/components/atoms/checkbox/checkbox";

interface FormCheckboxProps extends Omit<
  ICheckboxProps,
  "checked" | "onCheckedChange"
> {
  name: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  children,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox
          {...rest}
          id={name}
          checked={field.value}
          onCheckedChange={field.onChange}
        >
          {children}
        </Checkbox>
      )}
    />
  );
};
