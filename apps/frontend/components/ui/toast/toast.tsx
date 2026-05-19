import { toast as sonnerToast } from "sonner";
import React from "react";
import { CustomToast, ToastVariant } from "./toast-item";

const DEFAULT_TIMEOUT = 5000;
const ERROR_TIMEOUT = 7000; // Errors stay longer — users need time to read

function add(
  title: string,
  description?: string,
  variant: ToastVariant = "default",
  timeout = DEFAULT_TIMEOUT,
) {
  return sonnerToast.custom(
    (id) => (
      <CustomToast
        id={id}
        title={title}
        description={description}
        variant={variant}
      />
    ),
    {
      duration: timeout,
    },
  );
}

export const toast = {
  success(title: string, description?: string) {
    return add(title, description, "success");
  },

  error(title: string, description?: string) {
    return add(title, description, "error", ERROR_TIMEOUT);
  },

  warning(title: string, description?: string) {
    return add(title, description, "warning");
  },

  info(title: string, description?: string) {
    return add(title, description, "info");
  },

  default(title: string, description?: string) {
    return add(title, description, "default");
  },

  /** Close a specific toast by key returned from `add`. */
  close(key: string | number) {
    sonnerToast.dismiss(key);
  },

  clear() {
    sonnerToast.dismiss();
  },
};
