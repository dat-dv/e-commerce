import { type ComponentPropsWithoutRef } from "react";

export interface IViewAllButtonProps extends ComponentPropsWithoutRef<"a"> {
  href: string;
  label?: string;
  linkComponent?: React.ElementType;
}
