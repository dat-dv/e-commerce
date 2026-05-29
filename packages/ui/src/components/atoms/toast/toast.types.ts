export type { ToastOptions } from "./toast";
export type { ToastVariant } from "./toast-item";

export interface ICustomToastProps {
  id: string | number;
  title: string;
  description?: string;
  variant: import("./toast-item").ToastVariant;
}
