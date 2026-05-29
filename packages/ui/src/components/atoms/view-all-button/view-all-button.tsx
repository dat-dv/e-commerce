"use client";

import { ArrowRight } from "lucide-react";
import React from "react";

import { cn } from "../../../utils";
import { LiquidWaveText } from "../liquid-wave-text";
import { type IViewAllButtonProps } from "./view-all-button.types";

export const ViewAllButton = ({
  href,
  label = "View All",
  linkComponent: LinkComponent = "a",
  className,
  ...rest
}: IViewAllButtonProps) => {
  return (
    <LinkComponent
      href={href}
      className={cn(
        "text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium transition-colors",
        className,
      )}
      {...rest}
    >
      <LiquidWaveText inactiveClassName="text-primary/75">
        {label}
      </LiquidWaveText>
      <ArrowRight className="h-4 w-4" />
    </LinkComponent>
  );
};

ViewAllButton.displayName = "ViewAllButton";
