"use client";

import { AppForm, Avatar, Button, FormInput, FormSelect } from "@ecommerce/ui";
import { CalendarDays, Mail, Phone, Save } from "lucide-react";
import { useCallback, useState } from "react";

import { AvatarGallery } from "@/components/molecules/avatar-gallery";
import { DetailField } from "@/components/molecules/detail-field";
import { GENDER_OPTIONS } from "@/constants/gender.constanst";
import type { IAdminUser, IAdminUserAvatar } from "@/domain/user";
import { useUserDetailData } from "@/hooks/user/use-user-detail-data";
import { useUserDetailForm } from "@/hooks/user/use-user-detail-form";
import { useUserDetailMutations } from "@/hooks/user/use-user-detail-mutations";

import {
  formatAdminDate,
  getAdminUserDisplayName,
} from "./user-detail-view.utils";

export const UserDetailInfoTab = ({ userId }: { userId: string }) => {
  const [showGallery, setShowGallery] = useState(false);

  const { user, avatars, roles, setUser, setAvatars } =
    useUserDetailData(userId);

  const onSaveSuccess = useCallback(
    (updatedUser: IAdminUser, updatedAvatars: IAdminUserAvatar[]) => {
      setUser(updatedUser);
      setAvatars(updatedAvatars);
    },
    [setAvatars, setUser],
  );

  const methods = useUserDetailForm(user, avatars, roles);

  const { saving, handleSaveUser } = useUserDetailMutations(
    userId,
    onSaveSuccess,
  );

  const currentAvatarId = methods.watch("avatarId");
  const currentAvatarUrl =
    avatars.find((a) => a.id === currentAvatarId)?.url ||
    user?.avatarUrl ||
    undefined;

  if (!user) {
    return <div className="p-8 text-center text-red-500">User not found.</div>;
  }

  const phones =
    user.phones && user.phones.length > 0
      ? user.phones
          .map((phone) => `${phone.phone_code}${phone.phone}`)
          .join(", ")
      : "No registered phone number";

  return (
    <AppForm
      methods={methods}
      onSubmit={handleSaveUser}
      className="flex w-full flex-col gap-6"
    >
      {/* Overview & Avatar */}
      <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              name={getAdminUserDisplayName(user)}
              url={currentAvatarUrl}
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
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        {showGallery && (
          <div className="mt-6 border-t border-[var(--border-color)] pt-5">
            <h3 className="text-content text-sm font-bold">Avatar History</h3>
            <p className="text-content/50 mt-1 text-xs">
              Select an old avatar, then save changes.
            </p>

            <div className="mt-4">
              <AvatarGallery
                avatars={avatars}
                selectedAvatarId={currentAvatarId}
                onSetAvatar={(id) =>
                  methods.setValue("avatarId", id, { shouldDirty: true })
                }
              />
            </div>
          </div>
        )}
      </section>

      {/* Editable Profile */}
      <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-content text-lg font-bold">Editable Profile</h2>
            <p className="text-content/50 mt-1 text-sm">
              Admin can update the core account fields and save changes.
            </p>
          </div>
        </div>

        <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FormInput name="firstName" label="First name" size="md" />
          <FormInput name="lastName" label="Last name" size="md" />
          <FormInput
            name="dateOfBirth"
            label="Date of birth"
            type="date"
            size="md"
          />
          <FormSelect
            name="gender"
            label="Gender"
            size="md"
            options={GENDER_OPTIONS}
          />
          <FormSelect
            name="roleId"
            label="Role"
            size="md"
            options={roles.map((r) => ({
              label: r.role_name,
              value: r.id,
            }))}
          />
        </div>
      </section>

      <div className="flex items-center justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      {/* Info Details */}
    </AppForm>
  );
};
