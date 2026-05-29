"use client";

import React from "react";

import { cn } from "../../../utils";
import Button from "../../atoms/button";
import { AppDialog, AppDialogPanel } from "../../atoms/dialog";
import { XIcon } from "../../atoms/icons";
import { IModalProps } from "./modal.types";

export default function Modal({
  children,
  isOpen = true,
  onClose,
  closeLabel = "Close",
  isDismissable = true,
  showCloseButton = true,
  overlayClassName,
  panelClassName,
  closeButtonClassName,
}: IModalProps) {
  return (
    <AppDialog
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={isDismissable}
      className={overlayClassName}
    >
      <AppDialogPanel
        className={cn(
          "bg-surface border-content/10 relative w-full max-w-md rounded-3xl border p-8 shadow-2xl",
          panelClassName,
        )}
      >
        {showCloseButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={cn("absolute top-6 right-6", closeButtonClassName)}
            aria-label={closeLabel}
          >
            <XIcon />
          </Button>
        ) : null}
        {children}
      </AppDialogPanel>
    </AppDialog>
  );
}

Modal.displayName = "Modal";
