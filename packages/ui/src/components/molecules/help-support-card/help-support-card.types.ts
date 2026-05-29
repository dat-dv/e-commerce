import { type ElementType } from "react";

export interface IHelpSupportCardProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  showCta?: boolean;
  linkComponent?: ElementType;
  className?: string;
}
