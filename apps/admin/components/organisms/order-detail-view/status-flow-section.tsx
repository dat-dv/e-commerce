import { CheckCircle2, Clock3 } from "lucide-react";

import { getOrderStatus } from "@/components/organisms/orders-view/order.utils";
import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";

import { STATUS_FLOW } from "./order-detail.utils";

export const StatusFlowSection = ({
  order,
}: {
  order: IAdminCustomerOrder;
}) => (
  <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--border-color)] px-5 py-4">
    {STATUS_FLOW.map((status) => {
      const info = getOrderStatus(status);
      const isReached = order.status >= status;
      return (
        <div key={status} className="flex items-center gap-2">
          {isReached ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          ) : (
            <Clock3 className="h-4 w-4 text-[var(--muted)]" />
          )}
          <span className="text-sm font-semibold text-[var(--app-text)]">
            {info.label}
          </span>
        </div>
      );
    })}
  </div>
);
