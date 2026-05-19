"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { InputVariant } from "@/components/atoms/input/input.types";
import { ISelectOption, Select } from "@/components/atoms/select";

export interface IFormSelectProps {
  name: string;
  label: string;
  options: ISelectOption[];
  disabled?: boolean;
  variant?: InputVariant;
  className?: string;
}

export const FormSelect: React.FC<IFormSelectProps> = ({
  name,
  label,
  options,
  disabled,
  variant = "outline",
  className,
}) => {
  const t = useTranslations("Common.form");
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Select
          label={label}
          options={options}
          variant={variant}
          isDisabled={disabled}
          selectedKey={field.value !== undefined ? String(field.value) : ""}
          onSelectionChange={(val) => field.onChange(val)}
          placeholder={t("selectPlaceholder")}
          errorMessage={fieldState.error?.message}
          className={className}
        />
      )}
    />
  );
};
