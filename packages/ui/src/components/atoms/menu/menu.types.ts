import { type ReactNode } from "react";
import {
  type MenuItemProps as RACMenuItemProps,
  type MenuTriggerProps as RACMenuTriggerProps,
} from "react-aria-components";

export interface IAppMenuProps extends Omit<RACMenuTriggerProps, "trigger"> {
  trigger: ReactNode;
  children: ReactNode;
  isDisabled?: boolean;
  popoverClassName?: string;
  menuClassName?: string;
}

export interface IAppMenuItemProps extends RACMenuItemProps {
  className?: string;
}
