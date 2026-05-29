import { type ReactNode } from "react";

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeLabel?: string;
  showCloseButton?: boolean;
  overlayClassName?: string;
  panelClassName?: string;
  closeButtonClassName?: string;
  isDismissable?: boolean;
}
