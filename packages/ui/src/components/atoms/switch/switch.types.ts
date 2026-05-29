import { type ComponentPropsWithoutRef } from "react";

export interface ISwitchProps extends Omit<
  ComponentPropsWithoutRef<"button">,
  "onChange"
> {
  checked: boolean;
  onCheckedChange: () => void;
}
