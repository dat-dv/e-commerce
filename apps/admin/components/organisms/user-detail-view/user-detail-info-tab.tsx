"use client";

import { Avatar, Button } from "@ecommerce/ui";
import { CalendarDays, Mail, Phone, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

import type { IAdminUser, IAdminUserAvatar } from "@/domain/user";

import { useUserDetailData } from "./use-user-detail-data";
import { useUserDetailForm } from "./use-user-detail-form";
import { useUserDetailMutations } from "./use-user-detail-mutations";
import {
  formatAdminDate,
  getAdminUserDisplayName,
} from "./user-detail-view.utils";

const FIELD_CLASS =
  "focus:border-primary h-10 w-full rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 text-sm text-[var(--app-text)] outline-none";

const TEXTAREA_CLASS =
  "focus:border-primary min-h-20 w-full resize-none rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--app-text)] outline-none";

const DetailField = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <div className="flex items-start gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--app-bg)]/35 p-3">
    <Icon className="text-content/40 mt-0.5 h-4 w-4 shrink-0" />
    <div className="min-w-0">
      <p className="text-content/45 text-xs font-semibold tracking-wide uppercase">
        {label}
      </p>
      <p className="text-content mt-1 text-sm font-medium break-words">
        {value}
      </p>
    </div>
  </div>
);

export const UserDetailInfoTab = ({ userId }: { userId: string }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const { form, updateForm } = useUserDetailForm(
    user,
    avatars,
    roles,
    setSuccessMessage,
  );

  const { saving, deleting, handleSaveUser, handleDeleteUser } =
    useUserDetailMutations(
      userId,
      form,
      onSaveSuccess,
      setError,
      setSuccessMessage,
    );

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
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-content text-lg font-bold">Editable Profile</h2>
            <p className="text-content/50 mt-1 text-sm">
              Admin can update the core account fields and save changes.
            </p>
          </div>
          <Button
            onClick={handleSaveUser}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-content/45 text-xs font-bold tracking-wide uppercase">
              First name
            </span>
            <input
              value={form.firstName}
              onChange={(event) => updateForm("firstName", event.target.value)}
              className={FIELD_CLASS}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-content/45 text-xs font-bold tracking-wide uppercase">
              Last name
            </span>
            <input
              value={form.lastName}
              onChange={(event) => updateForm("lastName", event.target.value)}
              className={FIELD_CLASS}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-content/45 text-xs font-bold tracking-wide uppercase">
              Date of birth
            </span>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(event) =>
                updateForm("dateOfBirth", event.target.value)
              }
              className={FIELD_CLASS}
            />
          </label>

          <label className="space-y-1.5">
            <span className="text-content/45 text-xs font-bold tracking-wide uppercase">
              Gender
            </span>
            <select
              value={form.gender}
              onChange={(event) => updateForm("gender", event.target.value)}
              className={FIELD_CLASS}
            >
              <option value="">Not specified</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
              <option value="2">Other</option>
            </select>
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-content/45 text-xs font-bold tracking-wide uppercase">
              Role
            </span>
            <select
              value={form.roleId}
              onChange={(event) => updateForm("roleId", event.target.value)}
              className={FIELD_CLASS}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-content/45 text-xs font-bold tracking-wide uppercase">
              Admin note
            </span>
            <textarea
              value=""
              readOnly
              placeholder="Notes are not wired yet."
              className={TEXTAREA_CLASS}
            />
          </label>
        </div>

        {successMessage && (
          <p className="mt-4 text-sm font-medium text-emerald-500">
            {successMessage}
          </p>
        )}
      </section>

      <aside className="space-y-5">
        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
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
        </section>

        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
          <h3 className="text-content text-sm font-bold">Avatar History</h3>
          <p className="text-content/50 mt-1 text-xs">
            Select an old avatar, then save changes.
          </p>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {avatars.length > 0 ? (
              avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => updateForm("avatarId", avatar.id)}
                  className={`group relative aspect-square overflow-hidden rounded-lg border transition ${
                    form.avatarId === avatar.id
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
              <p className="text-content/45 col-span-4 text-sm">
                No previous avatars.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
          <div className="space-y-3">
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

        <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-red-400">
              Delete customer
            </h3>
            <p className="text-content/50 mt-1 text-sm">
              Soft-delete this account and hide it from customer lists.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={handleDeleteUser}
            disabled={deleting}
            className="w-full border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/15"
          >
            <Trash2 className="h-4 w-4" />
            <span>{deleting ? "Deleting..." : "Delete Customer"}</span>
          </Button>
        </section>
      </aside>
    </div>
  );
};
