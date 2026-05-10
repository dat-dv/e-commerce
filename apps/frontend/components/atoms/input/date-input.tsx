import { AnimatePresence, motion } from "framer-motion";
import React from "react";

import { cn } from "@/utils/cn";

import {
  variantBase,
  variantDisabled,
  variantError,
  variantNormal,
} from "./input.styles";
import { InputVariant } from "./input.types";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: InputVariant;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, label, error, id, variant = "outline", ...rest }, ref) => {
    const isDisabled = rest.disabled;

    const stateStyle = isDisabled
      ? variantDisabled[variant as keyof typeof variantDisabled]
      : error
        ? variantError[variant as keyof typeof variantError]
        : variantNormal[variant as keyof typeof variantNormal];

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-bold opacity-70 ml-1 tracking-tight text-content/80"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            {...rest}
            ref={ref}
            id={id}
            type="date"
            className={cn(
              "w-full outline-none transition-all duration-300 cursor-pointer uppercase",
              isDisabled && "cursor-not-allowed opacity-70",
              variantBase[variant as keyof typeof variantBase],
              stateStyle,
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />

          <AnimatePresence>
            {error && (
              <motion.span
                id={`${id}-error`}
                role="alert"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-6 left-1 text-[11px] font-bold text-red-500 lowercase tracking-tight"
              >
                {error}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
);

DateInput.displayName = "DateInput";
