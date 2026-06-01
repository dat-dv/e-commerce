"use client";

import { Button } from "@ecommerce/ui";

import { PageHeader } from "@/components/molecules/page-header";
import { APP_ROUTES } from "@/constants/routes";

import { useUserDetailView } from "./use-user-detail-view";
import { UserDetailTabs } from "./user-detail-tabs";

export const UserDetailView = () => {
  const {
    user,
    avatars,
    orders,
    roles,
    form,
    loading,
    saving,
    deleting,
    successMessage,
    updateForm,
    handleSaveUser,
    handleDeleteUser,
    router,
  } = useUserDetailView();

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
