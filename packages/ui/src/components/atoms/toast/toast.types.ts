import { ToastVariant } from "./toast-item";

export type { IToastOptions } from "./toast";
export type { ToastVariant } from "./toast-item";

export interface ICustomToastProps {
  id: string | number;
  title: string;
  description?: string;
  variant: ToastVariant;
}
