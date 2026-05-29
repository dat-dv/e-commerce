"use client";

import { motion } from "framer-motion";
import React from "react";
import {
  Dialog as RACDialog,
  DialogProps,
  Heading as RACHeading,
  type HeadingProps,
  Modal as RACModal,
  ModalOverlay as RACModalOverlay,
} from "react-aria-components";

import { cn } from "../../../utils";

const MotionModalOverlay = motion.create(RACModalOverlay);
const MotionModal = motion.create(RACModal);

export interface IAppDialogProps {
  children: React.ReactNode;
  className?: string;
  isDismissable?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function AppDialog({
  children,
  className,
  isDismissable = true,
  isOpen,
  onClose,
}: IAppDialogProps) {
  if (!isOpen) return null;

  return (
    <MotionModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable={isDismissable}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </MotionModalOverlay>
  );
}

export interface IAppDialogPanelProps extends DialogProps {
  children: React.ReactNode;
  className?: string;
}

export function AppDialogPanel({
  children,
  className,
  ...props
}: IAppDialogPanelProps) {
  return (
    <MotionModal
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("w-full max-w-md outline-none", className)}
    >
      <RACDialog
        className="h-full w-full outline-none"
        aria-label="Dialog"
        {...props}
      >
        {children}
      </RACDialog>
    </MotionModal>
  );
}

export interface IAppDialogTitleProps extends HeadingProps {
  as?: React.ElementType;
  children: React.ReactNode;
}

export function AppDialogTitle({
  as: Component = "h2",
  children,
  ...props
}: IAppDialogTitleProps) {
  const levelMap: Record<string, number> = {
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 6,
  };
  const level = typeof Component === "string" ? levelMap[Component] : undefined;

  return (
    <RACHeading slot="title" level={level} {...props}>
      {children}
    </RACHeading>
  );
}

export const Dialog = AppDialog;
export const DialogPanel = AppDialogPanel;
export const DialogTitle = AppDialogTitle;
