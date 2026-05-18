"use client";

import React, { useRef, useState } from "react";
import {
  DismissButton,
  FocusScope,
  mergeProps,
  useButton,
  useOverlay,
} from "react-aria";

interface AriaMenuRenderProps {
  close: () => void;
  isOpen: boolean;
}

interface AriaMenuTriggerProps {
  buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  isOpen: boolean;
}

interface AriaMenuProps {
  children: (props: AriaMenuRenderProps) => React.ReactNode;
  className?: string;
  disabled?: boolean;
  trigger: (props: AriaMenuTriggerProps) => React.ReactNode;
}

export function AriaMenu({
  children,
  className,
  disabled,
  trigger,
}: AriaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const close = () => setIsOpen(false);
  const { buttonProps } = useButton(
    {
      "aria-expanded": isOpen,
      "aria-haspopup": "menu",
      isDisabled: disabled,
      onPress: () => setIsOpen((open) => !open),
    },
    triggerRef,
  );
  const { overlayProps } = useOverlay(
    {
      isDismissable: true,
      isOpen,
      onClose: close,
      shouldCloseOnBlur: true,
    },
    menuRef,
  );

  return (
    <>
      {trigger({
        buttonProps: {
          ...buttonProps,
          ref: triggerRef,
          type: "button",
        } as React.ButtonHTMLAttributes<HTMLButtonElement>,
        isOpen,
      })}

      {isOpen && (
        <FocusScope restoreFocus>
          <div
            {...overlayProps}
            ref={menuRef}
            role="menu"
            className={className}
          >
            <DismissButton onDismiss={close} />
            {children({ close, isOpen })}
            <DismissButton onDismiss={close} />
          </div>
        </FocusScope>
      )}
    </>
  );
}

interface AriaMenuItemProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled"
> {
  disabled?: boolean;
}

export function AriaMenuItem({
  children,
  disabled,
  onClick,
  ...props
}: AriaMenuItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(
    {
      isDisabled: disabled,
      onPress: (event) => {
        onClick?.(
          event as object as React.MouseEvent<HTMLButtonElement, MouseEvent>,
        );
      },
    },
    ref,
  );

  return (
    <button
      {...mergeProps(buttonProps, props)}
      ref={ref}
      role="menuitem"
      type="button"
    >
      {children}
    </button>
  );
}
