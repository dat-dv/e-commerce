"use client";

import {
  ComponentPropsWithoutRef,
  ReactNode,
  RefObject,
  useRef,
  useState,
} from "react";
import {
  Dialog as RACDialog,
  Popover as RACPopover,
} from "react-aria-components";

import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";

interface DropdownTriggerProps {
  ref: RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export interface IAppDropdownProps extends ComponentPropsWithoutRef<"div"> {
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
  className,
  ...rest
}: IAppDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={cn("relative h-fit", className)} {...rest}>
      {trigger({
        ref: triggerRef,
        isOpen,
        toggle,
        open,
        close,
      })}

      <RACPopover
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement={align === "right" ? "bottom end" : "bottom start"}
        offset={8}
        className={cn(
          UI_RADIUS.popover,
          "border-content/10 z-[9999] w-auto min-w-[200px] overflow-hidden border",
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
      </RACPopover>
    </div>
  );
};

export const Dropdown = AppDropdown;
export default Dropdown;

AppDropdown.displayName = "AppDropdown";
