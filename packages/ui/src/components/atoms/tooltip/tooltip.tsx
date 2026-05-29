"use client";

import React from "react";
import {
  Tooltip as RACTooltip,
  TooltipTrigger as RACTooltipTrigger,
} from "react-aria-components";

import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { type ITooltipProps } from "./tooltip.types";

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
            UI_RADIUS.popover,
            "animate-in fade-in zoom-in-95 z-50 bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm transition-all duration-100 duration-200 select-none dark:bg-slate-100/90 dark:text-slate-900",
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

AppTooltip.displayName = "AppTooltip";

export const Tooltip = AppTooltip;

export default AppTooltip;
