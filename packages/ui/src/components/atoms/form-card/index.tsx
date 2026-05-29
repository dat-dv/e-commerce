import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import React from "react";

export interface FormCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FormCard = ({ children, className, ...props }: FormCardProps) => {
  return (
    <div
      className={cn(
        UI_RADIUS.panel,
        "dark:bg-surface/80 min-w-0 border border-white/20 bg-white/80 p-4 shadow-xl backdrop-blur-md sm:p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default FormCard;
