import { type ReactNode } from "react";

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  isDismissable?: boolean;
}
