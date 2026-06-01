"use client";

import type { IOrderResponse } from "@ecommerce/shared";
import { Avatar, Button, Tab, TabList, TabPanel, Tabs } from "@ecommerce/ui";
import {
  CalendarDays,
  Heart,
  Mail,
  Package,
  Phone,
  Save,
  ShoppingCart,
  Trash2,
  User,
} from "lucide-react";

import type { TAdminRole } from "@/domain/permission";
import type { IAdminUser, IAdminUserAvatar } from "@/domain/user";
import type { ApiListResponse } from "@/utils/request";

import { formatCurrency, getOrderStatus } from "../orders-view/order.utils";
import type { IUserDetailFormState } from "./use-user-detail-view";
import {
  formatAdminDate,
  getAdminUserDisplayName,
} from "./user-detail-view.utils";

interface IUserDetailTabsProps {
  user: IAdminUser;
  avatars: IAdminUserAvatar[];
  orders: ApiListResponse<IOrderResponse>;
  roles: TAdminRole[];
  form: IUserDetailFormState;
  saving: boolean;
  deleting: boolean;
  successMessage: string | null;
  onFormChange: <TField extends keyof IUserDetailFormState>(
    field: TField,
    value: IUserDetailFormState[TField],
  ) => void;
  onSave: () => void;
  onDelete: () => void;
}

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
  icon: typeof User;
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

const EmptyTabState = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Package;
}) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] p-8 text-center">
    <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="text-content text-sm font-semibold">{title}</h3>
    <p className="text-content/50 mt-1 max-w-md text-sm">{description}</p>
  </div>
);

export const UserDetailTabs = ({
  user,
  avatars,
  orders,
  roles,
  form,
  saving,
  deleting,
  successMessage,
  onFormChange,
  onSave,
  onDelete,
}: IUserDetailTabsProps) => {
  const phones =
    user.phones && user.phones.length > 0
      ? user.phones
          .map((phone) => `${phone.phone_code}${phone.phone}`)
          .join(", ")
      : "No registered phone number";

  return (
    <Tabs defaultSelectedKey="info" className="gap-5">
      <TabList>
        <Tab id="info">Info</Tab>
        <Tab id="orders">Orders</Tab>
        <Tab id="cart">Cart</Tab>
        <Tab id="favorites">Favorites</Tab>
        <Tab id="activity">Activity</Tab>
      </TabList>

      <TabPanel id="info" className="mt-0">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
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
                onClick={onSave}
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
                  onChange={(event) =>
                    onFormChange("firstName", event.target.value)
                  }
                  className={FIELD_CLASS}
                />
              </label>

              <label className="space-y-1.5">
                <span className="text-content/45 text-xs font-bold tracking-wide uppercase">
                  Last name
                </span>
                <input
                  value={form.lastName}
                  onChange={(event) =>
                    onFormChange("lastName", event.target.value)
                  }
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
                    onFormChange("dateOfBirth", event.target.value)
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
                  onChange={(event) =>
                    onFormChange("gender", event.target.value)
                  }
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
                  onChange={(event) =>
                    onFormChange("roleId", event.target.value)
                  }
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
                  <p className="text-content/50 truncate text-sm">
                    {user.email}
                  </p>
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
                      onClick={() => onFormChange("avatarId", avatar.id)}
                      className={`group relative aspect-square overflow-hidden rounded-lg border transition ${
                        form.avatarId === avatar.id
                          ? "border-primary ring-primary/30 ring-2"
                          : "hover:border-primary/60 border-[var(--border-color)]"
                      }`}
                      aria-label="Select avatar"
                    >
                      <img
                        src={avatar.url}
                        alt=""
                        className="h-full w-full object-cover"
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
                onClick={onDelete}
                disabled={deleting}
                className="w-full border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/15"
              >
                <Trash2 className="h-4 w-4" />
                <span>{deleting ? "Deleting..." : "Delete Customer"}</span>
              </Button>
            </section>
          </aside>
        </div>
      </TabPanel>

      <TabPanel id="orders" className="mt-0">
        <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-content text-lg font-bold">Orders</h2>
              <p className="text-content/50 mt-1 text-sm">
                Showing the latest {orders.items.length} of {orders.meta.total}{" "}
                orders for this customer.
              </p>
            </div>
          </div>

          {orders.items.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-[var(--border-color)]">
              <div className="min-w-[680px]">
                <div className="grid grid-cols-[1fr_150px_140px_160px] gap-4 bg-[var(--app-bg)]/40 px-4 py-3 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
                  <span>Order</span>
                  <span>Status</span>
                  <span>Total</span>
                  <span>Date</span>
                </div>
                <div className="divide-y divide-[var(--border-color)]">
                  {orders.items.map((order) => {
                    const status = getOrderStatus(order.status);

                    return (
                      <div
                        key={order.id}
                        className="grid grid-cols-[1fr_150px_140px_160px] gap-4 px-4 py-3 text-sm"
                      >
                        <code className="text-primary font-semibold">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </code>
                        <span
                          className={`w-fit rounded-md px-2 py-0.5 text-xs font-semibold ${status.color}`}
                        >
                          {status.label}
                        </span>
                        <span className="text-content font-semibold">
                          {formatCurrency(order.total_amount)}
                        </span>
                        <span className="text-content/55">
                          {formatAdminDate(order.created_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <EmptyTabState
              icon={Package}
              title="No orders yet"
              description="This customer has no order history."
            />
          )}
        </section>
      </TabPanel>

      <TabPanel id="cart" className="mt-0">
        <EmptyTabState
          icon={ShoppingCart}
          title="Cart snapshot will appear here"
          description="This tab is reserved for viewing the customer cart once the backend exposes an admin cart lookup by user id."
        />
      </TabPanel>

      <TabPanel id="favorites" className="mt-0">
        <EmptyTabState
          icon={Heart}
          title="Favorites will appear here"
          description="This tab is reserved for favorite products and categories tied to this customer."
        />
      </TabPanel>

      <TabPanel id="activity" className="mt-0">
        <EmptyTabState
          icon={User}
          title="Activity timeline will appear here"
          description="This tab can collect login events, profile changes, reviews, returns, and support activity."
        />
      </TabPanel>
    </Tabs>
  );
};

UserDetailTabs.displayName = "UserDetailTabs";
