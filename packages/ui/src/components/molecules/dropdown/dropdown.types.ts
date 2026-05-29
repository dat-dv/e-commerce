import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
} from "react";

export interface IDropdownTriggerProps {
  ref: RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export interface IAppDropdownProps extends ComponentPropsWithoutRef<"div"> {
  trigger: (props: IDropdownTriggerProps) => ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  closeOnContentClick?: boolean;
  popoverClassName?: string;
}
