"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { AriaMenu, AriaMenuItem } from "@/components/atoms/aria/menu";
import { cn } from "@/utils/cn";
import { aseanCountries } from "@/constants/countries";
import { AnimatePresence, motion } from "framer-motion";

interface CountryOption {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
  disabled?: boolean;
}

interface FormPhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string; // object name root (e.g. "phone")
  label?: string;
  countries?: CountryOption[];
  disabledSelected?: boolean;
}

export const FormPhoneInput: React.FC<FormPhoneInputProps> = ({
  name,
  label,
  className,
  countries = aseanCountries as CountryOption[],
  disabledSelected = false,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const phoneCode = value?.phoneCode || "+84";
        const phoneNumber = value?.phoneNumber || "";

        const country =
          countries.find((c) => c.dialCode === phoneCode) || countries[0];

        const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const num = e.target.value.replace(/[^0-9]/g, "");

          onChange({
            phoneCode,
            phoneNumber: num,
          });
        };

        const handleCountryChange = (dialCode: string) => {
          onChange({
            phoneCode: dialCode,
            phoneNumber,
          });
        };

        return (
          <div className="flex flex-col gap-1.5 w-full">
            {label && (
              <label className="text-sm font-bold opacity-70 ml-1 tracking-tight text-content/80">
                {label}
              </label>
            )}

            <div
              className={cn(
                "flex items-center border rounded-2xl transition-all focus-within:ring-2 focus-within:ring-primary/20",
                rest.disabled
                  ? "border-content/10 bg-content/5"
                  : error
                    ? "border-red-500 bg-surface/50"
                    : "border-content/[0.08] bg-surface/50",
                className,
              )}
            >
              {/* COUNTRY SELECT */}
              <div className="relative z-50 inline-block h-full text-left">
                <AriaMenu
                  disabled={rest.disabled}
                  className="absolute left-0 top-full z-[9999] mt-1 w-56 rounded-xl bg-surface border border-content/10 shadow-2xl max-h-60 overflow-y-auto"
                  trigger={({ buttonProps }) => (
                    <button
                      {...buttonProps}
                      className={cn(
                        "flex items-center gap-1 px-3 h-full border-r border-content/[0.08]",
                        rest.disabled
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer",
                      )}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span className="text-sm font-medium text-content/80">
                        {country.dialCode}
                      </span>
                      <ChevronDown size={14} />
                    </button>
                  )}
                >
                  {({ close }) => (
                    <>
                      {countries.map((c) => {
                        const isDisabled =
                          c.disabled ||
                          (disabledSelected && country.code === c.code);

                        return (
                          <AriaMenuItem
                            key={c.code}
                            disabled={isDisabled}
                            onClick={() => {
                              handleCountryChange(c.dialCode);
                              close();
                            }}
                            className={cn(
                              "flex w-full items-center gap-3 px-4 py-2 cursor-pointer hover:bg-content/[0.04] focus:bg-content/[0.04] focus:outline-none text-left",
                              isDisabled && "opacity-50",
                            )}
                          >
                            <span className="text-xl">{c.flag}</span>
                            <div>
                              <div className="text-sm">{c.name}</div>
                              <div className="text-xs text-content/50">
                                {c.dialCode}
                              </div>
                            </div>
                          </AriaMenuItem>
                        );
                      })}
                    </>
                  )}
                </AriaMenu>
              </div>

              {/* INPUT */}
              <input
                {...rest}
                type="tel"
                value={phoneNumber}
                onChange={handleNumberChange}
                placeholder="912345678"
                className="flex-1 bg-transparent outline-none px-4"
              />
            </div>

            {/* ERROR */}
            <AnimatePresence>
              {error && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] text-red-500 ml-1"
                >
                  {error.message}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        );
      }}
    />
  );
};
