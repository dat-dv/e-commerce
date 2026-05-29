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
          "group flex cursor-pointer items-center gap-2 outline-none select-none",
          renderProps.isFocusVisible && "ring-primary/50 rounded-lg ring-2",
          typeof className === "function" ? className(renderProps) : className,
        )
      }
    >
      {(renderProps) => (
        <>
          <div
            className={cn(
              "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all",
              renderProps.isSelected
                ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "border-content/[0.1] hover:border-content/[0.3] bg-white/50 backdrop-blur-sm",
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
