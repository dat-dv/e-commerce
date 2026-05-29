import { type ComponentPropsWithoutRef } from "react";

export interface ITextareaProps extends Omit<
  ComponentPropsWithoutRef<"textarea">,
  "size"
> {
  label?: string;
  error?: string;
  maxCount?: number;
}
