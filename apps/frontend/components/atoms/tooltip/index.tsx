"use client";

import React from "react";
import {
  Tooltip as RACTooltip,
  TooltipTrigger as RACTooltipTrigger,
  type TooltipProps as RACTooltipProps,
} from "react-aria-components";

import { cn } from "@/utils/cn";

export interface ITooltipProps extends Omit<RACTooltipProps, "children"> {
  content: React.ReactNode;
  children: React.ReactElement;
}

export function AppTooltip({
  content,
  children,
  className,
  offset = 8,
  ...props
}: ITooltipProps) {
  return (
    <RACTooltipTrigger>
      {children}
      <RACTooltip
        {...props}
        offset={offset}
        className={(renderProps) =>
          cn(
            "z-50 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900/90 dark:bg-slate-100/90 dark:text-slate-900 rounded-lg shadow-md backdrop-blur-sm select-none transition-all duration-200 animate-in fade-in zoom-in-95 duration-100",
            typeof className === "function"
              ? className(renderProps)
              : className,
          )
        }
      >
        {content}
      </RACTooltip>
    </RACTooltipTrigger>
  );
}

export const Tooltip = AppTooltip;
