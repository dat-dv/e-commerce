import { type ElementType } from "react";

export interface IMissingProductLabels {
  title?: string;
  description?: string;
}

export interface ISuggestedRoute {
  label: string;
  href: string;
}

export interface IMissingProductProps {
  labels?: IMissingProductLabels;
  suggestedRoutes?: ISuggestedRoute[];
  linkComponent?: ElementType;
  className?: string;
}
