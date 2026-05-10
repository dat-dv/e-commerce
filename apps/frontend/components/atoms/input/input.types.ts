export type InputVariant = "outline" | "underline" | "none";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  maxCount?: number;
}
