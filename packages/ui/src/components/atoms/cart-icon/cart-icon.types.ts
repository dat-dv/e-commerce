import { type ComponentPropsWithoutRef } from "react";

export interface ICartIconProps extends ComponentPropsWithoutRef<"div"> {
  isActive?: boolean;
  itemsCount?: number;
  size?: number;
}
