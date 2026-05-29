import { type ComponentPropsWithoutRef } from "react";

export interface IAvatarProps extends ComponentPropsWithoutRef<"div"> {
  url?: string;
  name?: string;
  size?: number;
  alt?: string;
}
