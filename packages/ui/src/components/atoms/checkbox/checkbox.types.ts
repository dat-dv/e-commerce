import { type ReactNode } from "react";
import {
  type CheckboxGroupProps as RACCheckboxGroupProps,
  type CheckboxProps as RACCheckboxProps,
  type ValidationResult,
} from "react-aria-components";

export interface ICheckboxProps extends RACCheckboxProps {
  checked?: boolean;
  onCheckedChange?: () => void;
}

export interface ICheckboxGroupProps extends Omit<
  RACCheckboxGroupProps,
  "children"
> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}
