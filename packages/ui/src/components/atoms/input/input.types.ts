import { InputSize } from "./input.sizes";

export type InputVariant = "outline" | "underline" | "none";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  maxCount?: number;
  size?: InputSize;
  passwordToggleLabels?: {
    show: string;
    hide: string;
  };
}
