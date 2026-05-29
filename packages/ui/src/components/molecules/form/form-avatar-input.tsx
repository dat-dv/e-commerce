"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { AvatarInput } from "../../atoms/avatar-input";

export interface IFormAvatarInputProps {
  name: string;
  displayName?: string;
  size?: number;
  disabled?: boolean;
}

export const FormAvatarInput = ({
  name,
  displayName,
  size = 160,
  disabled = false,
}: IFormAvatarInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <AvatarInput
          value={field.value}
          onChange={field.onChange}
          displayName={displayName}
          size={size}
          disabled={disabled}
        />
      )}
    />
  );
};

FormAvatarInput.displayName = "FormAvatarInput";

export default FormAvatarInput;
