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
import type { HTMLMotionProps } from "framer-motion";

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
  if (!isOpen) return null;

  return (
    <OverlayContainer>
      <AriaDialogContent
        className={className}
        isDismissable={isDismissable}
        isOpen={isOpen}
        onClose={onClose}
      >
        {children}
      </AriaDialogContent>
    </OverlayContainer>
  );
}

function AriaDialogContent({
  children,
  className,
  isDismissable,
  isOpen,
  onClose,
}: AriaDialogProps & { isDismissable: boolean }) {
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

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
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
  );
}

type MotionDivProps = Pick<
  HTMLMotionProps<"div">,
  "animate" | "exit" | "initial" | "transition"
>;

interface AriaDialogPanelProps
  extends React.HTMLAttributes<HTMLDivElement>, MotionDivProps {
  // Framer Motion panels need to render as motion.div while keeping aria props.
  as?: React.ElementType;
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
