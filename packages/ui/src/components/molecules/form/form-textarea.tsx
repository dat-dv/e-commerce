"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import Textarea, { ITextareaProps } from "../../atoms/textarea";

export interface FormTextareaProps extends Omit<
  ITextareaProps,
  "id" | "error"
> {
  name: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Textarea {...rest} {...field} id={name} error={error?.message} />
      )}
    />
  );
};
