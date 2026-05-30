"use client";

import { redirect } from "next/navigation";

import { APP_ROUTES } from "@/constants/routes";
import { useAdminUserStore } from "@/store/user";

export default function RootPage() {
  const userId = useAdminUserStore((s) => s.user?.id);

  if (userId) {
    redirect(APP_ROUTES.DASHBOARD);
  } else {
    redirect(APP_ROUTES.SIGN_IN);
  }
}
