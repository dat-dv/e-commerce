"use client";

import { Button } from "@ecommerce/ui";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { PageHeader } from "@/components/molecules/page-header";
import { APP_ROUTES } from "@/constants/routes";
import type { IAdminUser, IAdminUserAvatar } from "@/domain/user";

import { useUserDetailData } from "./use-user-detail-data";
import { useUserDetailForm } from "./use-user-detail-form";
import { useUserDetailMutations } from "./use-user-detail-mutations";
import { UserDetailTabs } from "./user-detail-tabs";

export const UserDetailView = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    user,
    avatars,
    roles,
    orders,
    loading,
    setUser,
    setAvatars,
    setError,
  } = useUserDetailData(userId);

  const onSaveSuccess = useCallback(
    (updatedUser: IAdminUser, updatedAvatars: IAdminUserAvatar[]) => {
      setUser(updatedUser);
      setAvatars(updatedAvatars);
    },
    [setAvatars, setUser],
  );

  const { form, updateForm } = useUserDetailForm(
    user,
    avatars,
    roles,
    setSuccessMessage,
  );

  const { saving, deleting, handleSaveUser, handleDeleteUser, router } =
    useUserDetailMutations(
      userId,
      form,
      onSaveSuccess,
      setError,
      setSuccessMessage,
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Workspace"
        description="Edit profile data, inspect avatar history, and review customer commerce activity."
        backAction={() => router.push(APP_ROUTES.CUSTOMERS)}
        backLabel="Back to customers"
      >
        <Button
          onClick={handleSaveUser}
          disabled={loading || !user || saving}
          className="w-full justify-center sm:w-auto"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </PageHeader>

      {!loading && user && (
        <UserDetailTabs
          user={user}
          avatars={avatars}
          orders={orders}
          roles={roles}
          form={form}
          saving={saving}
          deleting={deleting}
          successMessage={successMessage}
          onFormChange={updateForm}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
};

UserDetailView.displayName = "UserDetailView";
