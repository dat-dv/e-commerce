"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { ITextareaProps, Textarea } from "../../atoms/textarea";

export interface IFormTextareaProps extends Omit<
  ITextareaProps,
  "id" | "error"
> {
  name: string;
}

export const FormTextarea = ({ name, ...rest }: IFormTextareaProps) => {
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

FormTextarea.displayName = "FormTextarea";
