import { type ComponentPropsWithoutRef } from "react";

export interface IAddressEmptyStateProps extends ComponentPropsWithoutRef<"div"> {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}
