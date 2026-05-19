"use client";

import React from "react";
import {
  Section as RACSection,
  Header as RACHeader,
} from "react-aria-components";

import { IComboBoxSectionProps } from "./combobox.types";

export function AppComboBoxSection({
  title,
  children,
  ...props
}: IComboBoxSectionProps) {
  return (
    <RACSection {...props} className="first:mt-0 mt-2">
      {title && (
        <RACHeader className="px-4 py-1.5 text-xs font-bold text-content/50 uppercase tracking-wider">
          {title}
        </RACHeader>
      )}
      {children}
    </RACSection>
  );
}

export const ComboBoxSection = AppComboBoxSection;
