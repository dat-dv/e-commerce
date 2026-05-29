"use client";

import React from "react";

import { cn } from "../../../utils";
import { Button } from "../../atoms/button";
import { IHelpSupportCardProps } from "./help-support-card.types";

export function HelpSupportCard({
  title,
  description,
  ctaLabel,
  ctaHref,
  showCta = false,
  className = "",
  linkComponent,
}: IHelpSupportCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        "border-content/5 bg-surface rounded-xl border p-5 shadow-sm",
        className,
      )}
    >
      <h2 className="text-content text-base font-black">{title}</h2>
      <p className="text-content/60 mt-2 text-sm leading-6">{description}</p>
      {showCta && ctaLabel && ctaHref && (
        <Button
          href={ctaHref}
          variant="primary"
          size="md"
          className="mt-5 w-full"
          linkComponent={linkComponent}
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}

HelpSupportCard.displayName = "HelpSupportCard";
