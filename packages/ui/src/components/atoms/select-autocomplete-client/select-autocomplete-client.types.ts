import { type SelectProps as RACSelectProps } from "react-aria-components";

import { type InputSize } from "../input/input.sizes";
import { type InputVariant } from "../input/input.types";

export interface ISelectAutocompleteOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ISelectAutocompleteProps<T extends object> extends Omit<
  RACSelectProps<T>,
  "children" | "className"
> {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  description?: string;
  errorMessage?: string;
  variant?: InputVariant;
  size?: InputSize;
  className?: string;
  options: ISelectAutocompleteOption[];
  noResultsText?: string;
}
