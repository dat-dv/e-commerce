"use client";

import React, { type ReactNode } from "react";
import {
  CheckboxGroup as RACCheckboxGroup,
  type CheckboxGroupProps as RACCheckboxGroupProps,
  Label as RACLabel,
  Text as RACText,
  FieldError as RACFieldError,
  type ValidationResult,
} from "react-aria-components";
import { cn } from "../../../utils";

export interface ICheckboxGroupProps extends Omit<
  RACCheckboxGroupProps,
  "children"
> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function AppCheckboxGroup({
  label,
  children,
  description,
  errorMessage,
  className,
  ...props
}: ICheckboxGroupProps) {
  return (
    <RACCheckboxGroup
      {...props}
      className={(renderProps) =>
        cn(
          "flex flex-col gap-2 font-sans",
          typeof className === "function" ? className(renderProps) : className,
        )
      }
    >
      {label && (
        <RACLabel className="text-content text-sm font-bold">{label}</RACLabel>
      )}
      {children}
      {description && (
        <RACText slot="description" className="text-content/65 text-xs">
          {description}
        </RACText>
      )}
      <RACFieldError className="text-xs font-medium text-red-500">
        {errorMessage}
      </RACFieldError>
    </RACCheckboxGroup>
  );
}

export const CheckboxGroup = AppCheckboxGroup;
