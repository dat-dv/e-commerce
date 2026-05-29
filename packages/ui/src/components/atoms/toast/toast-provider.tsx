"use client";

import React from "react";
import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      theme="system"
      // We can customize the toast width and container properties if needed.
      // Since we are using toast.custom, Sonner renders our CustomToast exactly.
    />
  );
}

ToastProvider.displayName = "ToastProvider";
