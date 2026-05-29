"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import {
  AppSelectAutocompleteClient,
  ISelectAutocompleteOption,
  InputSize,
  InputVariant,
} from "@ecommerce/ui";

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

export const FormSelectAutocomplete: React.FC<IFormSelectAutocompleteProps> = ({
  name,
  label,
  options,
  disabled,
  variant = "outline",
  size,
  className,
  placeholder,
  searchPlaceholder,
  noResultsText,
}) => {
  const t = useTranslations("Common.form");
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
          placeholder={placeholder || t("selectPlaceholder")}
          searchPlaceholder={searchPlaceholder}
          noResultsText={noResultsText}
          errorMessage={fieldState.error?.message}
          className={className}
        />
      )}
    />
  );
};
