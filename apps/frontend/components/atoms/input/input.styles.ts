import { InputVariant } from "./input.types";

export const variantBase: Record<InputVariant, string> = {
  outline:
    "h-12 rounded-2xl border bg-white/5 backdrop-blur-xl px-4 text-base font-semibold",
  underline:
    "rounded-none border-b bg-transparent py-2 px-0 text-base font-semibold",
  none: "h-10 border-none bg-transparent p-0 focus:ring-0",
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
