import { cn } from "@/utils/cn";
import React from "react";

export interface FormCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FormCard = ({ children, className, ...props }: FormCardProps) => {
  return (
    <div
      className={cn(
        "min-w-0 p-4 sm:p-6 bg-white/80 dark:bg-surface/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default FormCard;
