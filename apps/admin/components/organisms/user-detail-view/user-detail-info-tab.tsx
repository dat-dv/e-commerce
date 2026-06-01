"use client";

import { Avatar, Button, FormInput, FormSelect } from "@ecommerce/ui";
import { CalendarDays, Mail, Phone, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { FormProvider } from "react-hook-form";

import { DetailField } from "@/components/molecules/detail-field";
import type { IAdminUser, IAdminUserAvatar } from "@/domain/user";

import { useUserDetailData } from "./use-user-detail-data";
import { useUserDetailForm } from "./use-user-detail-form";
import { useUserDetailMutations } from "./use-user-detail-mutations";
import {
  formatAdminDate,
  getAdminUserDisplayName,
} from "./user-detail-view.utils";

export const UserDetailInfoTab = ({ userId }: { userId: string }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  const {
    user,
    avatars,
    roles,
    loading,
    error,
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

  const methods = useUserDetailForm(user, avatars, roles);

  const { saving, deleting, handleSaveUser, handleDeleteUser } =
    useUserDetailMutations(userId, onSaveSuccess, setError, setSuccessMessage);

  const onSubmit = methods.handleSubmit(handleSaveUser);
  const currentAvatarId = methods.watch("avatarId");

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--muted)]">
        Loading user info...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8 text-center text-red-500">
        {error || "User not found."}
      </div>
    );
  }

  const phones =
    user.phones && user.phones.length > 0
      ? user.phones
          .map((phone) => `${phone.phone_code}${phone.phone}`)
          .join(", ")
      : "No registered phone number";

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-6">
        {/* Overview & Avatar */}
        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                name={getAdminUserDisplayName(user)}
                url={user.avatarUrl || undefined}
                size={64}
              />
              <div className="min-w-0">
                <h3 className="text-content truncate text-base font-bold">
                  {getAdminUserDisplayName(user)}
                </h3>
                <p className="text-content/50 truncate text-sm">{user.email}</p>
                <span className="bg-primary/10 text-primary mt-2 inline-flex rounded-md px-2 py-0.5 text-xs font-semibold">
                  {user.role?.roleName ?? "No role"}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowGallery(!showGallery)}
              className="hover:bg-content/5 border-[var(--border-color)] text-[var(--app-text)]"
            >
              {showGallery ? "Close gallery" : "Open avatar gallery"}
            </Button>
          </div>

          {showGallery && (
            <div className="mt-6 border-t border-[var(--border-color)] pt-5">
              <h3 className="text-content text-sm font-bold">Avatar History</h3>
              <p className="text-content/50 mt-1 text-xs">
                Select an old avatar, then save changes.
              </p>

              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                {avatars.length > 0 ? (
                  avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() =>
                        methods.setValue("avatarId", avatar.id, {
                          shouldDirty: true,
                        })
                      }
                      className={`group relative aspect-square overflow-hidden rounded-lg border transition ${
                        currentAvatarId === avatar.id
                          ? "border-primary ring-primary/30 ring-2"
                          : "hover:border-primary/60 border-[var(--border-color)]"
                      }`}
                      aria-label="Select avatar"
                    >
                      <Image
                        src={avatar.url}
                        alt=""
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                      {avatar.isCurrent && (
                        <span className="bg-primary absolute right-1 bottom-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-white">
                          Current
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-content/45 col-span-full text-sm">
                    No previous avatars.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Editable Profile */}
        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-content text-lg font-bold">
                Editable Profile
              </h2>
              <p className="text-content/50 mt-1 text-sm">
                Admin can update the core account fields and save changes.
              </p>
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormInput name="firstName" label="First name" />
            <FormInput name="lastName" label="Last name" />
            <FormInput name="dateOfBirth" label="Date of birth" type="date" />
            <FormSelect
              name="gender"
              label="Gender"
              options={[
                { label: "Not specified", value: "" },
                { label: "Male", value: "0" },
                { label: "Female", value: "1" },
                { label: "Other", value: "2" },
              ]}
            />
            <FormSelect
              name="roleId"
              label="Role"
              options={roles.map((r) => ({ label: r.role_name, value: r.id }))}
            />
          </div>

          {successMessage && (
            <p className="mt-4 text-sm font-medium text-emerald-500">
              {successMessage}
            </p>
          )}
        </section>

        {/* Info Details */}
        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
          <h2 className="text-content mb-4 text-lg font-bold">
            Contact & Metadata
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailField label="Email" value={user.email} icon={Mail} />
            <DetailField label="Phone" value={phones} icon={Phone} />
            <DetailField
              label="Created"
              value={formatAdminDate(user.createdAt)}
              icon={CalendarDays}
            />
            <DetailField
              label="Updated"
              value={formatAdminDate(user.updatedAt)}
              icon={CalendarDays}
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Delete customer</h3>
            <p className="text-content/50 mt-1 text-sm">
              Soft-delete this account and hide it from customer lists.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleDeleteUser}
            disabled={deleting}
            className="max-w-sm border-transparent bg-red-600 text-white shadow-sm transition-colors hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            <span>{deleting ? "Deleting..." : "Delete Customer"}</span>
          </Button>
        </section>
      </form>
    </FormProvider>
  );
};
