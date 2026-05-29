import { type ComponentPropsWithoutRef } from "react";

export interface ISettingsIconProps extends ComponentPropsWithoutRef<"div"> {
  isActive?: boolean;
  size?: number;
}
