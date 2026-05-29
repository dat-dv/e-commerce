import { InputVariant } from "./input.types";

export const variantBase: Record<InputVariant, string> = {
  outline: "border bg-white/5 backdrop-blur-xl font-normal w-full",
  underline: "rounded-none border-b bg-transparent font-normal w-full",
  none: "border-none bg-transparent p-0 focus:ring-0 font-normal w-full",
};

export const variantError: Record<InputVariant, string> = {
  outline:
    "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)] focus:border-red-500",
  underline: "border-red-500 focus:border-red-500",
  none: "",
};

export const variantNormal: Record<InputVariant, string> = {
  outline:
    "border-content/10 focus:border-primary focus:ring-1 focus:ring-primary/20 shadow-sm",
  underline: "border-content/20 focus:border-primary",
  none: "",
};

export const variantDisabled: Record<InputVariant, string> = {
  outline: "border-content/10 bg-content/5 shadow-none",
  underline: "border-content/10",
  none: "",
};

export const variantActive: Record<InputVariant, string> = {
  outline: "border-primary ring-1 ring-primary/20 shadow-sm shadow-primary/5",
  underline: "border-primary",
  none: "",
};
