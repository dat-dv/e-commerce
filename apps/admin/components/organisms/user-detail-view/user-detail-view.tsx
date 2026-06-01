"use client";

import { Button } from "@ecommerce/ui";
import { ArrowLeft } from "lucide-react";

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
    error,
    successMessage,
    updateForm,
    handleSaveUser,
    handleDeleteUser,
    router,
  } = useUserDetailView();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(APP_ROUTES.CUSTOMERS)}
            className="text-content hover:bg-primary/10 hover:text-primary rounded-lg"
            aria-label="Back to customers"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-0">
            <h1 className="text-content text-2xl font-bold tracking-tight sm:text-3xl">
              Customer Workspace
            </h1>
            <p className="text-content/55 mt-1 text-sm">
              Edit profile data, inspect avatar history, and review customer
              commerce activity.
            </p>
          </div>
        </div>

        <Button
          onClick={handleSaveUser}
          disabled={loading || !user || saving}
          className="w-full justify-center lg:w-auto"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {loading && (
        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
          <p className="text-content/55 text-sm">Loading customer...</p>
        </section>
      )}

      {!loading && error && (
        <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm font-medium text-red-400">{error}</p>
        </section>
      )}

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
