import React from "react";

import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { type IFormCardProps } from "./form-card.types";

export const FormCard = ({ children, className, ...rest }: IFormCardProps) => {
  return (
    <div
      className={cn(
        UI_RADIUS.panel,
        "dark:bg-surface/80 min-w-0 border border-white/20 bg-white/80 p-4 shadow-xl backdrop-blur-md sm:p-6",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

FormCard.displayName = "FormCard";
