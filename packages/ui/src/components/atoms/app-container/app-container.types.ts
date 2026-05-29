import { type ComponentPropsWithoutRef } from "react";

export type AppContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface IAppContainerProps extends ComponentPropsWithoutRef<"div"> {
  size?: AppContainerSize;
  center?: boolean;
}
