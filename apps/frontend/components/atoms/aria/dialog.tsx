"use client";

import React, { createContext, useContext, useRef } from "react";
import {
  FocusScope,
  mergeProps,
  OverlayContainer,
  useDialog,
  useModal,
  useOverlay,
  usePreventScroll,
} from "react-aria";

interface AriaDialogContextValue {
  panelProps: React.HTMLAttributes<HTMLDivElement>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  titleProps: React.HTMLAttributes<HTMLElement>;
}

const AriaDialogContext = createContext<AriaDialogContextValue | null>(null);

interface AriaDialogProps {
  children: React.ReactNode;
  className?: string;
  isDismissable?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function AriaDialog({
  children,
  className,
  isDismissable = true,
  isOpen,
  onClose,
}: AriaDialogProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps, underlayProps } = useOverlay(
    {
      isDismissable,
      isOpen,
      onClose,
    },
    ref,
  );
  const { modalProps } = useModal();
  const { dialogProps, titleProps } = useDialog({}, ref);

  usePreventScroll({ isDisabled: !isOpen });

  if (!isOpen) return null;

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    underlayProps.onMouseDown?.(event);

    if (
      isDismissable &&
      event.target instanceof Node &&
      ref.current &&
      !ref.current.contains(event.target)
    ) {
      onClose();
    }
  };

  return (
    <OverlayContainer>
      <div
        {...underlayProps}
        className={`${className ?? ""} fixed inset-0`}
        onMouseDown={handleMouseDown}
      >
        <FocusScope contain restoreFocus autoFocus>
          <AriaDialogContext.Provider
            value={{
              panelProps: mergeProps(overlayProps, dialogProps, modalProps),
              panelRef: ref,
              titleProps,
            }}
          >
            {children}
          </AriaDialogContext.Provider>
        </FocusScope>
      </div>
    </OverlayContainer>
  );
}

interface AriaDialogPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  // Framer Motion panels need to render as motion.div while keeping aria props.
  as?: React.ElementType;
  [key: string]: unknown;
}

export function AriaDialogPanel({
  as: Component = "div",
  children,
  ...props
}: AriaDialogPanelProps) {
  const context = useContext(AriaDialogContext);

  return (
    <Component
      {...mergeProps(context?.panelProps ?? {}, props)}
      ref={context?.panelRef}
    >
      {children}
    </Component>
  );
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface AriaDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag;
}

export function AriaDialogTitle({
  as: Component = "h2",
  children,
  ...props
}: AriaDialogTitleProps) {
  const context = useContext(AriaDialogContext);

  return (
    <Component {...mergeProps(context?.titleProps ?? {}, props)}>
      {children}
    </Component>
  );
}
