"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { InputSize, InputVariant } from "../../atoms/input";
import { ISelectOption, Select } from "../../atoms/select";

export interface IFormSelectProps {
  name: string;
  label?: string;
  options: ISelectOption[];
  disabled?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  className?: string;
  itemClassName?: string;
  placeholder?: string;
}

export const FormSelect: React.FC<IFormSelectProps> = ({
  name,
  label,
  options,
  disabled,
  variant = "outline",
  size,
  className,
  itemClassName,
  placeholder = "Select...",
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Select
          aria-label={label || name}
          label={label}
          options={options}
          variant={variant}
          isDisabled={disabled}
          size={size}
          selectedKey={field.value ?? undefined}
          onSelectionChange={(val) => field.onChange(val)}
          placeholder={placeholder}
          errorMessage={fieldState.error?.message}
          className={className}
          itemClassName={itemClassName}
        />
      )}
    />
  );
};
