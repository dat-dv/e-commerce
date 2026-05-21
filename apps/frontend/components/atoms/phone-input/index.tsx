"use client";

import { InputSize } from "@/components/atoms/input/input.sizes";
import { AppMenu, AppMenuItem } from "@/components/atoms/menu";
import { aseanCountries } from "@/constants/countries";
import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React from "react";

export interface PhoneValue {
  phoneCode: string;
  phoneNumber: string;
}

export interface CountryOption {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
  disabled?: boolean;
}

interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "onChange"
> {
  value?: PhoneValue;
  onChange?: (value: PhoneValue) => void;
  label?: string;
  error?: string;
  countries?: CountryOption[];
  disabledSelected?: boolean;
  size?: InputSize;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      className,
      countries = aseanCountries as CountryOption[],
      disabledSelected = false,
      size = "lg",
      id,
      ...rest
    },
    ref,
  ) => {
    const phoneCode = value?.phoneCode || "+84";
    const phoneNumber = value?.phoneNumber || "";
    const country =
      countries.find((item) => item.dialCode === phoneCode) || countries[0];

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.({
        phoneCode,
        phoneNumber: event.target.value.replace(/[^0-9]/g, ""),
      });
    };

    const handleCountryChange = (dialCode: string) => {
      onChange?.({
        phoneCode: dialCode,
        phoneNumber,
      });
    };

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={id}
            className="ml-1 text-sm font-bold tracking-tight text-content/80 opacity-70"
          >
            {label}
          </label>
        ) : null}

        <div
          className={cn(
            "flex items-center border transition-all focus-within:ring-2 focus-within:ring-primary/20",
            size === "sm" && "h-8 rounded-lg text-xs",
            size === "md" && "h-10 rounded-xl text-sm",
            size === "lg" && "h-12 rounded-2xl text-base",
            UI_RADIUS.input,
            rest.disabled
              ? "border-content/10 bg-content/5"
              : error
                ? "border-red-500 bg-surface/50"
                : "border-content/[0.08] bg-surface/50",
            className,
          )}
        >
          <div className="relative z-50 inline-block h-full text-left">
            <AppMenu
              isDisabled={rest.disabled}
              trigger={
                <div
                  className={cn(
                    "flex h-full items-center gap-1 border-r border-content/[0.08] px-3",
                    rest.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer",
                  )}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm font-medium text-content/80">
                    {country.dialCode}
                  </span>
                  <ChevronDown size={14} aria-hidden />
                </div>
              }
              popoverClassName="w-56"
            >
              {countries.map((item) => {
                const isDisabled =
                  item.disabled ||
                  (disabledSelected && country.code === item.code);

                return (
                  <AppMenuItem
                    key={item.code}
                    id={item.code}
                    isDisabled={isDisabled}
                    onAction={() => handleCountryChange(item.dialCode)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left hover:bg-content/[0.04] focus:bg-content/[0.04] focus:outline-none",
                      isDisabled && "opacity-50",
                    )}
                  >
                    <span className="text-xl">{item.flag}</span>
                    <div>
                      <div className="text-sm">{item.name}</div>
                      <div className="text-xs text-content/50">
                        {item.dialCode}
                      </div>
                    </div>
                  </AppMenuItem>
                );
              })}
            </AppMenu>
          </div>

          <input
            {...rest}
            ref={ref}
            id={id}
            type="tel"
            value={phoneNumber}
            onChange={handleNumberChange}
            placeholder={rest.placeholder ?? "912345678"}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className="h-full flex-1 bg-transparent px-4 outline-none"
          />
        </div>

        <AnimatePresence>
          {error ? (
            <motion.span
              id={`${id}-error`}
              role="alert"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="ml-1 text-[11px] text-red-500"
            >
              {error}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
