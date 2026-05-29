import { type ComponentPropsWithoutRef } from "react";

export interface IFavoriteIconProps extends ComponentPropsWithoutRef<"div"> {
  isActive?: boolean;
  size?: number;
}
