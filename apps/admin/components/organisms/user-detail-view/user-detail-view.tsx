"use client";

import { APP_ROUTES } from "@/constants/routes";

import { useUserDetailView } from "./use-user-detail-view";
import { UserDangerZone } from "./user-danger-zone";
import { UserDetailHeader } from "./user-detail-header";
import { UserProfilePanel } from "./user-profile-panel";
import { UserRolePanel } from "./user-role-panel";

export const UserDetailView = () => {
  const {
    user,
    roles,
    selectedRoleId,
    savingRole,
    deleting,
    error,
    successMessage,
    setSelectedRoleId,
    setSuccessMessage,
    handleSaveRole,
    handleDeleteUser,
    router,
  } = useUserDetailView();

  return (
    <div className="space-y-6">
      <UserDetailHeader
        user={user}
        onBack={() => router.push(APP_ROUTES.CUSTOMERS)}
      />

      {(error || successMessage) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            error
              ? "border-red-500/20 bg-red-500/10 text-red-300"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {error || successMessage}
        </div>
      )}

      {user && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <UserProfilePanel user={user} />

          <div className="space-y-6">
            <UserRolePanel
              roles={roles}
              selectedRoleId={selectedRoleId}
              saving={savingRole}
              onRoleChange={(roleId) => {
                setSelectedRoleId(roleId);
                setSuccessMessage(null);
              }}
              onSave={handleSaveRole}
            />

            <UserDangerZone deleting={deleting} onDelete={handleDeleteUser} />
          </div>
        </div>
      )}
    </div>
  );
};

UserDetailView.displayName = "UserDetailView";
