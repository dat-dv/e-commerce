"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { ISelectOption, InputSize, InputVariant, Select } from "@ecommerce/ui";

export interface IFormSelectProps {
  name: string;
  label?: string;
  options: ISelectOption[];
  disabled?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  className?: string;
  itemClassName?: string;
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
}) => {
  const t = useTranslations("Common.form");
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
          placeholder={t("selectPlaceholder")}
          errorMessage={fieldState.error?.message}
          className={className}
          itemClassName={itemClassName}
        />
      )}
    />
  );
};
