"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React from "react";

import { TYPOGRAPHY, UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { AppMenu, AppMenuItem } from "../menu";
import { ICountryOption, IPhoneInputProps } from "./phone-input.types";

const DEFAULT_COUNTRIES: ICountryOption[] = [
  {
    name: "Vietnam",
    code: "VN",
    flag: "VN",
    dialCode: "+84",
    disabled: false,
  },
];

export const PhoneInput = React.forwardRef<HTMLInputElement, IPhoneInputProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      className,
      countries = DEFAULT_COUNTRIES,
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
            className={`text-content/80 ml-1 ${TYPOGRAPHY.bodySmall} font-bold tracking-tight opacity-70`}
          >
            {label}
          </label>
        ) : null}

        <div
          className={cn(
            "focus-within:ring-primary/20 flex items-center overflow-hidden border transition-all focus-within:ring-2",
            UI_RADIUS.input,
            size === "sm" && "h-8 text-xs",
            size === "md" && "h-10 text-sm",
            size === "lg" && "h-12 text-base",
            rest.disabled
              ? "border-content/10 bg-content/5"
              : error
                ? "bg-surface/50 border-red-500"
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
                    "border-content/[0.08] flex h-full items-center gap-1 border-r px-3",
                    rest.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer",
                  )}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span
                    className={`text-content/80 ${TYPOGRAPHY.bodySmall} font-medium`}
                  >
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
                      "hover:bg-content/[0.04] focus:bg-content/[0.04] flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left focus:outline-none",
                      isDisabled && "opacity-50",
                    )}
                  >
                    <span className="text-xl">{item.flag}</span>
                    <div>
                      <div className={TYPOGRAPHY.bodySmall}>{item.name}</div>
                      <div className={`text-content/50 ${TYPOGRAPHY.caption}`}>
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
              className={`ml-1 ${TYPOGRAPHY.badge} text-red-500`}
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
