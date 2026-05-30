"use client";

import { BasicLoading } from "@ecommerce/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { APP_ROUTES } from "@/constants/routes";
import {
  AdminPermissionRepository,
  type TAdminRole,
} from "@/domain/permission";
import { AdminUserRepository, type IAdminUser } from "@/domain/user";

import { UserDangerZone } from "./user-danger-zone";
import { UserDetailHeader } from "./user-detail-header";
import { UserProfilePanel } from "./user-profile-panel";
import { UserRolePanel } from "./user-role-panel";

export const UserDetailView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const userRepository = useMemo(() => new AdminUserRepository(), []);
  const permissionRepository = useMemo(
    () => new AdminPermissionRepository(),
    [],
  );

  const [user, setUser] = useState<IAdminUser | null>(null);
  const [roles, setRoles] = useState<TAdminRole[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingRole, setSavingRole] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadUserDetail = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setError("Missing user id.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [userResponse, rolesResponse] = await Promise.all([
        userRepository.getUser(userId),
        permissionRepository.getRoles(),
      ]);

      setUser(userResponse);
      setRoles(rolesResponse.items);
      setSelectedRoleId(
        userResponse.roleId || rolesResponse.items[0]?.id || "",
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load user detail.");
    } finally {
      setLoading(false);
    }
  }, [permissionRepository, userId, userRepository]);

  useEffect(() => {
    loadUserDetail();
  }, [loadUserDetail]);

  const handleSaveRole = async () => {
    if (!userId || !selectedRoleId) return;

    setSavingRole(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updatedUser = await userRepository.updateUser(userId, {
        role_id: selectedRoleId,
      });
      setUser(updatedUser);
      setSuccessMessage("User role updated.");
    } catch (err) {
      console.error(err);
      setError("Failed to update user role.");
    } finally {
      setSavingRole(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userId) return;
    if (!window.confirm("Delete this user?")) return;

    setDeleting(true);
    setError(null);

    try {
      await userRepository.deleteUser(userId);
      router.push(APP_ROUTES.CUSTOMERS);
    } catch (err) {
      console.error(err);
      setError("Failed to delete user.");
      setDeleting(false);
    }
  };

  return (
    <>
      {loading && <BasicLoading isBlur={false} />}

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
    </>
  );
};

UserDetailView.displayName = "UserDetailView";
