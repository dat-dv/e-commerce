"use client";

import React from "react";
import {
  Header as RACHeader,
  Section as RACSection,
} from "react-aria-components";

import { IComboBoxSectionProps } from "./combobox.types";

export function AppComboBoxSection({
  title,
  children,
  ...props
}: IComboBoxSectionProps) {
  return (
    <RACSection {...props} className="mt-2 first:mt-0">
      {title && (
        <RACHeader className="text-content/50 px-4 py-1.5 text-xs font-bold tracking-wider uppercase">
          {title}
        </RACHeader>
      )}
      {children}
    </RACSection>
  );
}

AppComboBoxSection.displayName = "AppComboBoxSection";

export const ComboBoxSection = AppComboBoxSection;
ComboBoxSection.displayName = "ComboBoxSection";
