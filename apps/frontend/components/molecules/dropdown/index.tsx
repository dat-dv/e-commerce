"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useRef, useState } from "react";
import {
  Button as RACButton,
  Popover as RACPopover,
  Dialog as RACDialog,
} from "react-aria-components";

const MotionPopover = motion(RACPopover);

export interface IAppDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  closeOnContentClick?: boolean;
}

export const AppDropdown = ({
  trigger,
  children,
  align = "right",
  closeOnContentClick = true,
}: IAppDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <RACButton
        ref={triggerRef}
        onPress={() => setIsOpen((prev) => !prev)}
        className="outline-none cursor-pointer select-none"
      >
        {trigger}
      </RACButton>
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
            className={[
              "z-[9999] w-72 outline-none",
              "bg-surface/95 backdrop-blur-3xl",
              "rounded-2xl border border-content/[0.08]",
              "shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_70px_-10px_rgba(0,0,0,0.4)] p-2",
            ].join(" ")}
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
