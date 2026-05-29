"use client";

import React from "react";
import {
  type ComboBoxProps as RACComboBoxProps,
  type ComboBoxRenderProps,
  type ListBoxItemProps as RACListBoxItemProps,
  type Section as RACSection,
  type ValidationResult,
} from "react-aria-components";

import { InputSize } from "../input/input.sizes";
import { InputVariant } from "../input/input.types";

export interface IComboBoxOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface IComboBoxProps<
  T extends object,
  M extends "single" | "multiple" = "single",
> extends Omit<RACComboBoxProps<T, M>, "children" | "className"> {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  variant?: InputVariant;
  size?: InputSize;
  className?: string | ((values: ComboBoxRenderProps) => string);
  options?: IComboBoxOption[];
  children?: React.ReactNode | ((item: T) => React.ReactNode);
  multipleValuePlaceholder?: string;
}

export interface IComboBoxItemProps extends RACListBoxItemProps {
  className?: string;
}

export interface IComboBoxSectionProps extends React.ComponentPropsWithoutRef<
  typeof RACSection
> {
  title?: string;
  children?: React.ReactNode;
}
