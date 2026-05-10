"use client";

import Link from "next/link";
import React, { forwardRef } from "react";

import { cn } from "@/utils/cn";

import { sizeClasses, variantClasses } from "./button.style";
import { ButtonProps } from "./button.types";

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      children,
      loading,
      href,
      ...rest
    }: ButtonProps,
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const classes = cn(
      base,
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    const loader = loading && (
      <div className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
    );

    if (href !== undefined) {
      return (
        <Link
          href={href}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {loader}
          {children}
        </Link>
      );
    }

    const {
      type = "button",
      disabled,
      ...btnRest
    } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        type={type}
        disabled={loading || disabled}
        {...btnRest}
      >
        {loader}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
