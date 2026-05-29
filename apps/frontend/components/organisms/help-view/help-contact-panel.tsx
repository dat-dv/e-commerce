"use client";

import { Button } from "@ecommerce/ui";
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
    <aside className="border-content/5 bg-surface self-start rounded-lg border p-5 shadow-sm">
      <Headphones className="text-primary size-6" aria-hidden="true" />
      <h2 className="text-content mt-4 text-lg font-black">{title}</h2>
      <p className="text-content/60 mt-2 text-sm leading-6">{description}</p>
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
