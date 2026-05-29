import { type ComponentPropsWithoutRef } from "react";

export interface IPhoneValue {
  phoneCode: string;
  phoneNumber: string;
}

export interface ICountryOption {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
  disabled?: boolean;
}

export interface IPhoneInputProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "size" | "value" | "onChange"
> {
  value?: IPhoneValue;
  onChange?: (value: IPhoneValue) => void;
  label?: string;
  error?: string;
  countries?: ICountryOption[];
  disabledSelected?: boolean;
  size?: import("../input/input.sizes").InputSize;
}
