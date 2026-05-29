import { toast as sonnerToast } from "sonner";

import { CustomToast, ToastVariant } from "./toast-item";

export const DEFAULT_TIMEOUT = 5000;
export const ERROR_TIMEOUT = 7000;

type ToastId = string | number;

export interface IToastOptions {
  id?: ToastId;
  description?: string;
  duration?: number;
}

function showToast(
  title: string,
  variant: ToastVariant = "default",
  options: IToastOptions = {},
): ToastId {
  const { id, description, duration } = options;
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
  show(title: string, options?: IToastOptions & { variant?: ToastVariant }) {
    return showToast(title, options?.variant, options);
  },

  success(title: string, options?: IToastOptions) {
    return showToast(title, "success", options);
  },

  warning(title: string, options?: IToastOptions) {
    return showToast(title, "warning", options);
  },

  info(title: string, options?: IToastOptions) {
    return showToast(title, "info", options);
  },

  error(title: string, options?: IToastOptions) {
    return showToast(title, "error", options);
  },

  default(title: string, options?: IToastOptions) {
    return showToast(title, "default", options);
  },

  close(id: ToastId) {
    sonnerToast.dismiss(id);
  },

  clear() {
    sonnerToast.dismiss();
  },
};
