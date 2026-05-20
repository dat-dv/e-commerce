"use client";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";
import { Headphones } from "lucide-react";

interface HelpContactPanelProps {
  title: string;
  description: string;
  ctaLabel: string;
}

export function HelpContactPanel({
  title,
  description,
  ctaLabel,
}: HelpContactPanelProps): React.ReactElement {
  return (
    <aside className="self-start rounded-lg border border-content/5 bg-surface p-5 shadow-sm">
      <Headphones className="size-6 text-primary" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-black text-content">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-content/60">{description}</p>
      <Button
        href={APP_ROUTES.CONTACT}
        variant="primary"
        size="lg"
        className="mt-5 w-full"
      >
        {ctaLabel}
      </Button>
    </aside>
  );
}
