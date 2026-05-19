"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, RefObject, useRef, useState } from "react";
import {
  Dialog as RACDialog,
  Popover as RACPopover,
} from "react-aria-components";

import { cn } from "@/utils/cn";

const MotionPopover = motion.create(RACPopover);

interface DropdownTriggerProps {
  ref: RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export interface IAppDropdownProps {
  trigger: (props: DropdownTriggerProps) => ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  closeOnContentClick?: boolean;
  popoverClassName?: string;
}

export const AppDropdown = ({
  trigger,
  children,
  align = "right",
  closeOnContentClick = true,
  popoverClassName,
}: IAppDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <>
      {trigger({
        ref: triggerRef,
        isOpen,
        toggle,
        open,
        close,
      })}

      <AnimatePresence>
        {isOpen && (
          <MotionPopover
            triggerRef={triggerRef}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            placement={align === "right" ? "bottom end" : "bottom start"}
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className={cn(
              "z-[9999] w-auto min-w-[200px] overflow-hidden rounded-2xl border border-content/10",
              "bg-surface/85 p-1.5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl",
              "outline-none dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)]",
              popoverClassName,
            )}
          >
            <RACDialog className="outline-none">
              {({ close }) => (
                <div
                  onClick={() => {
                    if (closeOnContentClick) {
                      close();
                    }
                  }}
                >
                  {children}
                </div>
              )}
            </RACDialog>
          </MotionPopover>
        )}
      </AnimatePresence>
    </>
  );
};

export const Dropdown = AppDropdown;
