import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

import { cn } from "@/utils/cn";

import {
  variantBase,
  variantDisabled,
  variantError,
  variantNormal,
} from "./input.styles";
import { InputVariant } from "./input.types";

interface DateInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onInvalid"
> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  onInvalid?: (message: string) => void;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    { className, label, error, id, variant = "outline", onInvalid, ...rest },
    ref,
  ) => {
    const isDisabled = rest.disabled;

    const stateStyle = isDisabled
      ? variantDisabled[variant as keyof typeof variantDisabled]
      : error
        ? variantError[variant as keyof typeof variantError]
        : variantNormal[variant as keyof typeof variantNormal];

    // Helper to convert ISO string (or any string) to YYYY-MM-DD
    const formatDateToYMD = (val?: string | number | readonly string[]) => {
      if (!val || typeof val !== "string") return "";
      return val.split("T")[0]; // Extracts YYYY-MM-DD
    };

    const nativeValue = formatDateToYMD(rest.value);
    const nativeMax = "2026-05-11"; // Hardcoded today for testing
    const nativeMin = "2026-05-11"; // Hardcoded today for testing

    const localRef = React.useRef<HTMLInputElement>(null);

    // Forward the local ref to the parent ref
    React.useImperativeHandle(ref, () => localRef.current!);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (!val) {
        rest.onChange?.(e);
        return;
      }

      const date = new Date(val);

      // If the date is invalid (e.g. typing "11111"), pass the raw value to avoid crash
      if (isNaN(date.getTime())) {
        rest.onChange?.(e);
        return;
      }

      const isoString = date.toISOString();

      // Override the target value with ISO string for parent components
      const customEvent = {
        ...e,
        target: { ...e.target, value: isoString },
      };

      rest.onChange?.(customEvent);
    };

    const handleIconClick = () => {
      localRef.current?.showPicker();
    };

    const handleInvalidDate = (e: React.InvalidEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement;
      const validity = target.validity;
      let message = "Invalid date"; // Default message
      if (validity.rangeOverflow) {
        message = "Date cannot be later than the allowed date";
      } else if (validity.rangeUnderflow) {
        message = "Date cannot be earlier than the allowed date";
      } else if (validity.valueMissing) {
        message = "Please enter a date";
      }
      onInvalid?.(message);
    };

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

        <div className="relative flex items-center">
          <input
            {...rest}
            value={nativeValue}
            max={nativeMax}
            min={nativeMin}
            onChange={handleOnChange}
            ref={localRef}
            id={id}
            type="date"
            className={cn(
              "w-full outline-none transition-all duration-300 cursor-pointer uppercase pr-10",
              isDisabled && "cursor-not-allowed opacity-70",
              variantBase[variant as keyof typeof variantBase],
              stateStyle,
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            onInvalid={handleInvalidDate}
          />

          <button
            type="button"
            onClick={handleIconClick}
            disabled={isDisabled}
            className="absolute right-3 text-content/50 hover:text-content/80 transition-colors cursor-pointer"
          >
            <Calendar size={18} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.span
              id={`${id}-error`}
              role="alert"
              initial={{ opacity: 0, height: 0, y: -5 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -5 }}
              className="text-[11px] font-bold text-red-500 tracking-tight ml-1 overflow-hidden"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

DateInput.displayName = "DateInput";
