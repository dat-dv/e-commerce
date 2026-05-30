import { Button } from "@ecommerce/ui";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { APP_ROUTES } from "@/constants/routes";

const SettingsHeader = () => {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push(APP_ROUTES.DASHBOARD)}
        className="rounded-lg text-[var(--sidebar-text)] hover:bg-white/8 hover:text-[var(--app-text)]"
        aria-label="Back to Dashboard"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--app-text)]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Manage your administrative preferences and account controls.
        </p>
      </div>
    </div>
  );
};

export default SettingsHeader;
