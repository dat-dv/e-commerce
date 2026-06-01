import { useRouter } from "next/navigation";
import React from "react";

import { PageHeader } from "@/components/molecules/page-header";
import { APP_ROUTES } from "@/constants/routes";

export const SettingsHeader = () => {
  const router = useRouter();
  return (
    <PageHeader
      title="Settings"
      description="Manage your administrative preferences and account controls."
      backAction={() => router.push(APP_ROUTES.DASHBOARD)}
      backLabel="Back to Dashboard"
    />
  );
};
