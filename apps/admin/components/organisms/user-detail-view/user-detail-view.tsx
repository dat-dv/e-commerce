"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { PageHeader } from "@/components/molecules/page-header";
import { APP_ROUTES } from "@/constants/routes";

import { UserDetailTabs } from "./user-detail-tabs";

export const UserDetailView = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Workspace"
        description="Edit profile data, inspect avatar history, and review customer commerce activity."
        backAction={() => router.push(APP_ROUTES.CUSTOMERS)}
        backLabel="Back to customers"
      />

      {userId ? (
        <UserDetailTabs userId={userId} />
      ) : (
        <div className="p-8 text-center text-red-500">Missing user ID</div>
      )}
    </div>
  );
};

UserDetailView.displayName = "UserDetailView";
