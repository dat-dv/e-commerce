"use client";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import React from "react";

interface HelpSupportCardProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  showCta?: boolean;
  className?: string;
}

export function HelpSupportCard({
  title,
  description,
  ctaLabel,
  ctaHref = APP_ROUTES.CONTACT,
  showCta = false,
  className = "",
}: HelpSupportCardProps): React.ReactElement {
  return (
    <div
      className={`border-content/5 bg-surface rounded-xl border p-5 shadow-sm ${className}`}
    >
      <h2 className="text-content text-base font-black">{title}</h2>
      <p className="text-content/60 mt-2 text-sm leading-6">{description}</p>
      {showCta && ctaLabel && (
        <Button
          href={ctaHref}
          variant="primary"
          size="md"
          className="mt-5 w-full"
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}

export default HelpSupportCard;
