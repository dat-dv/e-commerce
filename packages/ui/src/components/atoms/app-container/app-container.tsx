import React from "react";

import { cn } from "../../../utils";
import { IAppContainerProps } from "./app-container.types";

const sizeClasses = {
  sm: "max-w-xl",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  "2xl": "max-w-7xl",
  full: "max-w-full",
} as const;

export const AppContainer = ({
  children,
  className,
  size = "2xl",
  center = true,
  ...rest
}: IAppContainerProps) => {
  return (
    <div
      className={cn(
        "w-full px-4 sm:px-6 lg:px-8",
        center && "mx-auto",
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

AppContainer.displayName = "AppContainer";
