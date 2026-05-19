"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { AriaMenu, AriaMenuItem } from "@/components/atoms/aria/menu";
import { cn } from "@/utils/cn";
import {
  variantBase,
  variantNormal,
  variantDisabled,
  variantActive,
} from "@/components/atoms/input/input.styles";
import { InputVariant } from "@/components/atoms/input/input.types";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Common.form");
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

          <div className="relative inline-block text-left w-full">
            <AriaMenu
              disabled={disabled}
              className="absolute z-[100] mt-1 w-full origin-top-right rounded-xl bg-surface border border-content/10 shadow-2xl backdrop-blur-md focus:outline-none overflow-hidden"
              trigger={({ buttonProps, isOpen }) => (
                <button
                  {...buttonProps}
                  className={cn(
                    "w-full flex justify-between items-center transition-all font-medium",
                    variantBase[variant],
                    disabled
                      ? variantDisabled[variant]
                      : variantNormal[variant],
                    isOpen && variantActive[variant],
                    className,
                  )}
                >
                  <input
                    type="text"
                    readOnly
                    value={
                      options.find((opt) => opt.value === field.value)?.label ||
                      ""
                    }
                    placeholder={t("selectPlaceholder")}
                    className="bg-transparent border-none outline-none w-full pointer-events-none placeholder:opacity-50 text-content font-normal"
                  />
                  <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                </button>
              )}
            >
              {({ close }) => (
                <>
                  <div className="py-1">
                    {options.map((option) => (
                      <AriaMenuItem
                        key={option.value}
                        onClick={() => {
                          field.onChange(option.value);
                          close();
                        }}
                        disabled={option.disabled}
                        className={cn(
                          "group flex w-full items-center px-4 py-3 text-base font-normal transition-colors text-content hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary focus:outline-none",
                          option.disabled && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        {option.label}
                      </AriaMenuItem>
                    ))}
                  </div>
                </>
              )}
            </AriaMenu>
          </div>
        </div>
      )}
    />
  );
};
