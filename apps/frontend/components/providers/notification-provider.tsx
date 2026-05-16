"use client";

import { useFCM } from "@/hooks/notifications/use-fcm";
import { ReactNode } from "react";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  useFCM();
  return <>{children}</>;
};
