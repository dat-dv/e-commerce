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

export interface IAppDropdownProps extends Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> {
  trigger: (props: IDropdownTriggerProps) => ReactNode;
  children: ((props: { close: () => void }) => ReactNode) | ReactNode;
  align?: "left" | "right";
  closeOnContentClick?: boolean;
  popoverClassName?: string;
}
