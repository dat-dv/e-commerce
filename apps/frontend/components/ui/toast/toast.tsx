import { TToastId } from "@/constants/toast.constant";
import { toast as sonnerToast } from "sonner";
import { CustomToast, ToastVariant } from "./toast-item";

const DEFAULT_TIMEOUT = 5000;
const ERROR_TIMEOUT = 7000;

type ToastId = string | number;

export interface ToastOptions {
  id?: TToastId;
  description?: string;
  duration?: number;
}

function showToast(
  title: string,
  variant: ToastVariant = "default",
  { description, duration, id }: ToastOptions = {},
): ToastId {
  return sonnerToast.custom(
    (toastId) => (
      <CustomToast
        id={toastId}
        title={title}
        description={description}
        variant={variant}
      />
    ),
    {
      id,
      duration:
        duration ?? (variant === "error" ? ERROR_TIMEOUT : DEFAULT_TIMEOUT),
    },
  );
}

export const toast = {
  show(title: string, options?: ToastOptions & { variant?: ToastVariant }) {
    return showToast(title, options?.variant, options);
  },

  success(title: string, options?: ToastOptions) {
    return showToast(title, "success", options);
  },

  warning(title: string, options?: ToastOptions) {
    return showToast(title, "warning", options);
  },

  info(title: string, options?: ToastOptions) {
    return showToast(title, "info", options);
  },

  error(title: string, options?: ToastOptions) {
    return showToast(title, "error", options);
  },

  default(title: string, options?: ToastOptions) {
    return showToast(title, "default", options);
  },

  close(id: ToastId) {
    sonnerToast.dismiss(id);
  },

  clear() {
    sonnerToast.dismiss();
  },
};
