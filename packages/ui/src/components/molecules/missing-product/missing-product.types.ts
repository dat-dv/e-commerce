import { type ElementType } from "react";

export interface IMissingProductLabels {
  title?: string;
  description?: string;
  continueShopping?: string;
  goBack?: string;
}

export interface ISuggestedRoute {
  label: string;
  href: string;
}

export interface IMissingProductProps {
  labels?: IMissingProductLabels;
  suggestedRoutes?: ISuggestedRoute[];
  continueShoppingHref?: string;
  onGoBack?: () => void;
  linkComponent?: ElementType;
  className?: string;
}
