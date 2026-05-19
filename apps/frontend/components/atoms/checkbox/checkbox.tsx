"use client";

import { cn } from "@/utils/cn";
import { Check } from "lucide-react";
import {
  Checkbox as RACCheckbox,
  type CheckboxProps as RACCheckboxProps,
} from "react-aria-components";

export interface ICheckboxProps extends RACCheckboxProps {
  checked?: boolean;
  onCheckedChange?: () => void;
}

export const Checkbox = ({
  checked,
  onCheckedChange,
  className,
  children,
  ...props
}: ICheckboxProps) => {
  const isSelected = checked ?? props.isSelected;
  const onChange = onCheckedChange ?? props.onChange;

  return (
    <RACCheckbox
      {...props}
      isSelected={isSelected}
      onChange={onChange}
      className={(renderProps) =>
        cn(
          "group flex items-center gap-2 cursor-pointer select-none outline-none",
          renderProps.isFocusVisible && "ring-2 ring-primary/50 rounded-lg",
          typeof className === "function" ? className(renderProps) : className,
        )
      }
    >
      {(renderProps) => (
        <>
          <div
            className={cn(
              "w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center flex-shrink-0",
              renderProps.isSelected
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "border-content/[0.1] bg-white/50 backdrop-blur-sm hover:border-content/[0.3]",
            )}
          >
            {renderProps.isSelected && <Check size={14} strokeWidth={4} />}
          </div>
          {typeof children === "function" ? children(renderProps) : children}
        </>
      )}
    </RACCheckbox>
  );
};
