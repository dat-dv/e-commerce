import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useState } from "react";

import { TYPOGRAPHY } from "../../../tokens";
import { cn } from "../../../utils";

import { inputSizeClasses } from "./input.sizes";
import {
  variantBase,
  variantDisabled,
  variantError,
  variantNormal,
} from "./input.styles";
import { InputProps } from "./input.types";
import PasswordEye from "./password-eye";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      error,
      className,
      variant = "outline",
      size = "lg",
      maxCount,
      value,
      passwordToggleLabels,
      ...rest
    },
    ref,
  ) => {
    const isPassword = rest.type === "password";
    const [showPassword, setShowPassword] = useState(false);
    const isDisabled = rest.disabled;

    const valueLength = String(value ?? "").length;
    const isNearlyFull = maxCount && valueLength >= maxCount * 0.8;
    const isOverLimit = maxCount && valueLength > maxCount;

    const stateStyle = isDisabled
      ? variantDisabled[variant as keyof typeof variantDisabled]
      : error
        ? variantError[variant as keyof typeof variantError]
        : variantNormal[variant as keyof typeof variantNormal];

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-content/80 ml-1 text-sm font-bold tracking-tight opacity-70"
          >
            {label}
          </label>
        )}

        <div className="group relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full transition-all duration-300 outline-none placeholder:opacity-50",
              isDisabled && "cursor-not-allowed opacity-70",
              variantBase[variant],
              inputSizeClasses[size][variant],
              stateStyle,
              (isPassword || maxCount) && "pr-12",
              isPassword && maxCount && "pr-20",
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            maxLength={maxCount}
            {...rest}
            value={value ?? ""}
            type={isPassword && showPassword ? "text" : rest.type || "text"}
          />

          <div
            className={`pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2 select-none ${TYPOGRAPHY.badge}`}
          >
            {maxCount && (
              <span
                className={cn(
                  "rounded-md border border-white/5 bg-white/5 px-1.5 py-0.5 backdrop-blur-md transition-colors duration-300",
                  isOverLimit
                    ? "border-red-500/20 text-red-500"
                    : isNearlyFull
                      ? "border-amber-500/20 text-amber-500"
                      : "text-content/30",
                )}
              >
                {valueLength}/{maxCount}
              </span>
            )}
            {isPassword && (
              <div className="pointer-events-auto">
                <PasswordEye
                  showPassword={showPassword}
                  handleShowPassword={() => setShowPassword((v) => !v)}
                  labels={passwordToggleLabels}
                />
              </div>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.span
              id={`${id}-error`}
              role="alert"
              initial={{ opacity: 0, height: 0, y: -5 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -5 }}
              className={`ml-1 overflow-hidden font-bold tracking-tight text-red-500 ${TYPOGRAPHY.badge}`}
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
