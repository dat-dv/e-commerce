"use client";

import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/utils/cn";
import {
  variantBase,
  variantNormal,
  variantDisabled,
} from "@/components/atoms/input/input.styles";
import { InputVariant } from "@/components/atoms/input/input.types";

interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface FormSelectProps {
  name: string;
  label: string;
  options: Option[];
  disabled?: boolean;
  variant?: InputVariant;
  className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  disabled,
  variant = "outline",
  className,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5 w-full">
          {label && (
            <label className="text-sm font-bold opacity-70 ml-1 tracking-tight text-content/80">
              {label}
            </label>
          )}

          <Menu as="div" className="relative inline-block text-left w-full">
            {({ open }) => (
              <>
                <div>
                  <MenuButton
                    disabled={disabled}
                    className={cn(
                      "w-full flex justify-between items-center transition-all font-medium",
                      variantBase[variant],
                      disabled
                        ? variantDisabled[variant]
                        : variantNormal[variant],
                      open && "border-primary ring-1 ring-primary/20",
                      className,
                    )}
                  >
                    <input
                      type="text"
                      readOnly
                      value={
                        options.find((opt) => opt.value === field.value)
                          ?.label || ""
                      }
                      placeholder="Select..."
                      className="bg-transparent border-none outline-none w-full pointer-events-none placeholder:opacity-50 text-content/80"
                    />
                    <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                  </MenuButton>
                </div>

                <MenuItems className="absolute z-[100] mt-1 w-full origin-top-right rounded-xl bg-surface border border-content/10 shadow-2xl backdrop-blur-md focus:outline-none overflow-hidden">
                  <div className="py-1">
                    {options.map((option) => (
                      <MenuItem key={option.value} disabled={option.disabled}>
                        {({ active, disabled }) => (
                          <button
                            type="button"
                            onClick={() => field.onChange(option.value)}
                            disabled={disabled}
                            className={cn(
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-content",
                              disabled && "opacity-50 cursor-not-allowed",
                              "group flex w-full items-center px-4 py-3 text-sm font-medium transition-colors",
                            )}
                          >
                            {option.label}
                          </button>
                        )}
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </>
            )}
          </Menu>
        </div>
      )}
    />
  );
};
