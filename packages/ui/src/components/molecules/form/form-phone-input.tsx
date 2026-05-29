"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";

import { InputSize } from "../../atoms/input";
import PhoneInput, {
  ICountryOption,
  IPhoneValue,
} from "../../atoms/phone-input";

export const aseanCountries: ICountryOption[] = [
  {
    name: "Vietnam",
    code: "VN",
    dialCode: "+84",
    flag: "🇻🇳",
    disabled: false,
  },
  {
    name: "Thailand",
    code: "TH",
    dialCode: "+66",
    flag: "🇹🇭",
    disabled: true,
  },
  {
    name: "Singapore",
    code: "SG",
    dialCode: "+65",
    flag: "🇸🇬",
    disabled: true,
  },
  {
    name: "Malaysia",
    code: "MY",
    dialCode: "+60",
    flag: "🇲🇾",
    disabled: true,
  },
  {
    name: "Indonesia",
    code: "ID",
    dialCode: "+62",
    flag: "🇮🇩",
    disabled: true,
  },
  {
    name: "Philippines",
    code: "PH",
    dialCode: "+63",
    flag: "🇵🇭",
    disabled: true,
  },
  {
    name: "Brunei",
    code: "BN",
    dialCode: "+673",
    flag: "🇧🇳",
    disabled: true,
  },
  {
    name: "Cambodia",
    code: "KH",
    dialCode: "+855",
    flag: "🇰🇭",
    disabled: true,
  },
  {
    name: "Laos",
    code: "LA",
    dialCode: "+856",
    flag: "🇱🇦",
    disabled: true,
  },
  {
    name: "Myanmar",
    code: "MM",
    dialCode: "+95",
    flag: "🇲🇲",
    disabled: true,
  },
];

export interface FormPhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "onChange"
> {
  name: string;
  label?: string;
  countries?: ICountryOption[];
  disabledSelected?: boolean;
  size?: InputSize;
}

export const FormPhoneInput: React.FC<FormPhoneInputProps> = ({
  name,
  label,
  className,
  countries = aseanCountries,
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
          value={value as IPhoneValue | undefined}
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
