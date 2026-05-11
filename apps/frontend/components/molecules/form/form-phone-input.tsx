"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { aseanCountries } from "@/constants/countries";

interface FormPhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

export const FormPhoneInput: React.FC<FormPhoneInputProps> = ({
  name,
  label,
  className,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const valStr = value || "";
        const country =
          aseanCountries.find((c) => valStr.startsWith(c.dialCode)) ||
          aseanCountries[0];

        const number = valStr.startsWith(country.dialCode)
          ? valStr.slice(country.dialCode.length)
          : valStr;

        const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const num = e.target.value.replace(/[^0-9]/g, "");
          onChange(country.dialCode + num);
        };

        const handleCountryChange = (dialCode: string) => {
          onChange(dialCode + number);
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
                "flex items-center border rounded-xl h-10 bg-surface/50 backdrop-blur-sm transition-all focus-within:ring-2 focus-within:ring-primary/20",
                error
                  ? "border-red-500 focus-within:border-red-500"
                  : "border-content/[0.08] focus-within:border-primary",
                className,
              )}
            >
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton
                  className={cn(
                    "flex items-center gap-1 px-3 h-full border-r border-content/[0.08] hover:bg-content/[0.02] cursor-pointer",
                    rest.disabled && "pointer-events-none opacity-50",
                  )}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm font-medium text-content/80">
                    {country.code}
                  </span>
                  <ChevronDown size={14} className="text-content/50" />
                </MenuButton>
                <MenuItems
                  anchor="bottom start"
                  className="z-[100] mt-1 w-56 origin-top-left rounded-xl bg-surface border border-content/10 shadow-2xl backdrop-blur-md focus:outline-none overflow-hidden"
                >
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {aseanCountries.map((c) => (
                      <MenuItem key={c.code}>
                        {({ active }) => (
                          <div
                            onClick={() => handleCountryChange(c.dialCode)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors",
                              active || country.code === c.code
                                ? "bg-content/[0.04]"
                                : "",
                            )}
                          >
                            <span className="text-xl">{c.flag}</span>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-content/80">
                                {c.name}
                              </span>
                              <span className="text-xs text-content/50">
                                {c.dialCode}
                              </span>
                            </div>
                          </div>
                        )}
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <input
                {...rest}
                type="tel"
                value={number}
                onChange={handleNumberChange}
                className="flex-1 h-full bg-transparent border-none outline-none focus:outline-none px-4 text-sm"
              />
            </div>

            {error && (
              <span className="text-xs text-red-500 ml-1 mt-0.5">
                {error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};
