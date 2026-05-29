import { UI_RADIUS } from "../../../tokens";
import { InputVariant } from "./input.types";

export type InputSize = "sm" | "md" | "lg";

export const inputSizeClasses: Record<
  InputSize,
  Record<InputVariant, string>
> = {
  sm: {
    outline: `h-8 ${UI_RADIUS.input} px-3 text-xs`,
    underline: "py-1 text-xs",
    none: "h-8 text-xs",
  },
  md: {
    outline: `h-10 ${UI_RADIUS.input} px-4 text-sm`,
    underline: "py-1.5 text-sm",
    none: "h-10 text-sm",
  },
  lg: {
    outline: `h-12 ${UI_RADIUS.input} px-4 text-base`,
    underline: "py-2 text-base",
    none: "h-12 text-base",
  },
};
