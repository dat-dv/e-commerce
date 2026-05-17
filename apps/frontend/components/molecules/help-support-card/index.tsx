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
      className={`rounded-xl border border-content/5 bg-surface p-5 shadow-sm ${className}`}
    >
      <h2 className="text-base font-black text-content">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-content/60">{description}</p>
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
