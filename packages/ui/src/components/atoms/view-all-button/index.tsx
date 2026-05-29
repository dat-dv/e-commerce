"use client";

import { ArrowRight } from "lucide-react";
import React from "react";

import { cn } from "../../../utils";
import LiquidWaveText from "../liquid-wave-text";

export interface ViewAllButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  label?: string;
  linkComponent?: React.ElementType;
}

export const ViewAllButton: React.FC<ViewAllButtonProps> = ({
  href,
  label = "View All",
  linkComponent: LinkComponent = "a",
  className,
  ...props
}) => {
  return (
    <LinkComponent
      href={href}
      className={cn(
        "text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium transition-colors",
        className,
      )}
      {...props}
    >
      <LiquidWaveText inactiveClassName="text-primary/75">
        {label}
      </LiquidWaveText>
      <ArrowRight className="h-4 w-4" />
    </LinkComponent>
  );
};

export default ViewAllButton;
