import { type ReactNode } from "react";
import {
  type SelectProps as RACSelectProps,
  type SelectRenderProps,
  type ValidationResult,
} from "react-aria-components";

import { type InputSize } from "../input/input.sizes";
import { type InputVariant } from "../input/input.types";

export interface ISelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ISelectProps<T extends object> extends Omit<
  RACSelectProps<T>,
  "children" | "className"
> {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  variant?: InputVariant;
  size?: InputSize;
  className?: string | ((values: SelectRenderProps) => string);
  itemClassName?: string;
  options?: ISelectOption[];
  children?: ReactNode | ((item: T) => ReactNode);
}
