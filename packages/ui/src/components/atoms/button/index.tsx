"use client";

import React, { forwardRef } from "react";
import { Button as BaseButton } from "react-aria-components";

import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";

import { sizeClasses, variantClasses } from "./button.style";
import { IButtonProps } from "./button.types";

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, IButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      children,
      loading,
      href,
      ...rest
    }: IButtonProps,
    ref,
  ) => {
    const base = cn(
      UI_RADIUS.control,
      "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
    );

    const classes = cn(
      base,
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    const loader = loading && (
      <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    );

    if (href !== undefined) {
      const { linkComponent: LinkComponent = "a", ...anchorProps } =
        rest as any;
      return (
        <LinkComponent
          href={href}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...anchorProps}
        >
          {loader}
          {children}
        </LinkComponent>
      );
    }

    const {
      type = "button",
      disabled,
      ...btnRest
    } = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <BaseButton
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        type={type}
        isDisabled={loading || disabled}
        {...(btnRest as Record<string, unknown>)}
      >
        {loader}
        {children}
      </BaseButton>
    );
  },
);

Button.displayName = "Button";

export default Button;
