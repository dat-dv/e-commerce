"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { InputSize, InputVariant } from "../../atoms/input";
import {
  AppSelectAutocompleteClient,
  ISelectAutocompleteOption,
} from "../../atoms/select-autocomplete-client";

export interface IFormSelectAutocompleteProps {
  name: string;
  label?: string;
  options: ISelectAutocompleteOption[];
  disabled?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  noResultsText?: string;
}

export const FormSelectAutocomplete = ({
  name,
  label,
  options,
  disabled,
  variant = "outline",
  size,
  className,
  placeholder = "Select...",
  searchPlaceholder,
  noResultsText,
}: IFormSelectAutocompleteProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <AppSelectAutocompleteClient
          label={label}
          options={options}
          variant={variant}
          isDisabled={disabled}
          size={size}
          selectedKey={field.value ?? undefined}
          onSelectionChange={(val) => field.onChange(val)}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          noResultsText={noResultsText}
          errorMessage={fieldState.error?.message}
          className={className}
        />
      )}
    />
  );
};

FormSelectAutocomplete.displayName = "FormSelectAutocomplete";

export default FormSelectAutocomplete;
