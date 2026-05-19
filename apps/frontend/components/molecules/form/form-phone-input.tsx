"use client";

import { InputSize } from "@/components/atoms/input/input.sizes";
import PhoneInput, {
  CountryOption,
  PhoneValue,
} from "@/components/atoms/phone-input";
import { aseanCountries } from "@/constants/countries";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface FormPhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "onChange"
> {
  name: string;
  label?: string;
  countries?: CountryOption[];
  disabledSelected?: boolean;
  size?: InputSize;
}

export const FormPhoneInput: React.FC<FormPhoneInputProps> = ({
  name,
  label,
  className,
  countries = aseanCountries as CountryOption[],
  disabledSelected = false,
  size = "lg",
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
        <PhoneInput
          {...rest}
          ref={ref}
          id={name}
          value={value as PhoneValue | undefined}
          onChange={onChange}
          label={label}
          error={error?.message}
          countries={countries}
          disabledSelected={disabledSelected}
          size={size}
          className={className}
        />
      )}
    />
  );
};
