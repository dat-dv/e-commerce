"use client";

import { Star } from "lucide-react";
import React from "react";
import { Radio as AriaRadio, RadioGroup } from "react-aria-components";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";

export interface IFormRatingProps<T extends FieldValues> {
  name: Path<T>;
  methods: UseFormReturn<T>;
  label?: string;
  max?: number;
  disabled?: boolean;
  getAriaLabel?: (rating: number) => string;
}

export const FormRating = <T extends FieldValues>({
  name,
  methods,
  label,
  max = 5,
  disabled = false,
  getAriaLabel,
}: IFormRatingProps<T>): React.ReactElement => {
  return (
    <Controller
      name={name}
      control={methods.control}
      render={({ field, fieldState }) => {
        const value = field.value ? String(field.value) : "";

        return (
          <div>
            <RadioGroup
              value={value}
              onChange={(nextValue) => field.onChange(Number(nextValue))}
              onBlur={field.onBlur}
              isDisabled={disabled}
              aria-label={label || "Rating"}
              className="flex flex-col gap-1"
            >
              {label && (
                <div className="text-content text-sm font-semibold">
                  {label}
                </div>
              )}

              <div className="flex gap-1">
                {Array.from({ length: max }, (_, index) => index + 1).map(
                  (rating) => {
                    const isActive = rating <= Number(value || 0);

                    return (
                      <AriaRadio
                        key={rating}
                        value={String(rating)}
                        aria-label={getAriaLabel?.(rating) || `${rating} stars`}
                        className="group focus-visible:ring-primary/50 rounded-lg p-1 text-amber-400 transition-colors outline-none hover:bg-amber-400/10 focus-visible:ring-2 data-disabled:pointer-events-none data-disabled:opacity-50"
                      >
                        <Star
                          className="size-6"
                          fill={isActive ? "currentColor" : "none"}
                          aria-hidden
                        />
                      </AriaRadio>
                    );
                  },
                )}
              </div>
            </RadioGroup>

            {fieldState.error?.message && (
              <p className="mt-1 text-xs font-bold text-red-500">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

FormRating.displayName = "FormRating";

export default FormRating;
