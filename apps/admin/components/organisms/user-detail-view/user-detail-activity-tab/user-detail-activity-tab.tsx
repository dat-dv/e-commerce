"use client";

import { Clock, Heart, Package, ShoppingCart, User } from "lucide-react";

import { EmptyTabState } from "@/components/molecules/empty-tab-state";
import { formatAdminDate } from "@/components/organisms/user-detail-view/user-detail-view.utils";
import type { IAdminCustomerActivityItem } from "@/domain/user";
import { useUserDetailActivity } from "@/hooks/user/use-user-detail-activity";

const ICON_BY_TYPE: Record<IAdminCustomerActivityItem["type"], typeof User> = {
  account: User,
  order: Package,
  cart: ShoppingCart,
  favorite: Heart,
};

export const UserDetailActivityTab = ({ userId }: { userId: string }) => {
  const { activities, loading } = useUserDetailActivity(userId);

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--muted)]">
        Loading activity...
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-content text-lg font-bold">Activity</h2>
        <p className="text-content/50 mt-1 text-sm">
          Timeline built from account, order, cart, and favorite events.
        </p>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((item, index) => {
            const Icon = ICON_BY_TYPE[item.type];

            return (
              <article
                key={`${item.id}-${index}`}
                className="flex gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--app-bg)]/30 p-4"
              >
                <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-content font-semibold">{item.title}</p>
                    <span className="text-content/45 text-xs">
                      {formatAdminDate(item.occurredAt)}
                    </span>
                  </div>
                  <p className="text-content/55 mt-1 text-sm">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyTabState
          icon={Clock}
          title="No activity yet"
          description="There are no account, order, cart, or favorite events for this customer."
        />
      )}
    </section>
  );
};

UserDetailActivityTab.displayName = "UserDetailActivityTab";
