"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { Checkbox, ICheckboxProps } from "../../atoms/checkbox";

export interface IFormCheckboxProps extends Omit<
  ICheckboxProps,
  "checked" | "onCheckedChange"
> {
  name: string;
}

export const FormCheckbox: React.FC<IFormCheckboxProps> = ({
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

FormCheckbox.displayName = "FormCheckbox";
