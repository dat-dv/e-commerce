import { EOrderStatus } from "@ecommerce/shared";
import { Button, Select } from "@ecommerce/ui";

import { getOrderStatus } from "@/components/organisms/orders-view/order.utils";
import type { IAdminCustomerOrder } from "@/domain/user/types/user.model";

interface IStatusSectionProps {
  order: IAdminCustomerOrder;
  canUpdateStatus: boolean;
  isUpdating: boolean;
  selectedStatus: EOrderStatus | "";
  availableStatuses: EOrderStatus[];
  setSelectedStatus: (status: EOrderStatus | "") => void;
  updateStatus: () => void;
}

export const StatusSection = ({
  order,
  canUpdateStatus,
  isUpdating,
  selectedStatus,
  availableStatuses,
  setSelectedStatus,
  updateStatus,
}: IStatusSectionProps) => {
  const currentStatus = getOrderStatus(order.status);
  const hasNextStatus = availableStatuses.some(
    (status) => status > order.status,
  );
  const statusOptions = availableStatuses.map((status) => ({
    label: getOrderStatus(status).label,
    value: status,
    disabled: status <= order.status,
  }));

  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">
          Current status
        </p>
        <span
          className={`mt-2 inline-flex rounded-md px-3 py-1 text-sm font-semibold ${currentStatus.color}`}
        >
          {currentStatus.label}
        </span>
        {!canUpdateStatus && (
          <p className="mt-3 text-sm text-[var(--muted)]">
            Your role can view this order but cannot update status.
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:min-w-[360px] sm:grid-cols-[1fr_auto]">
        <Select
          aria-label="Select order status"
          placeholder={
            canUpdateStatus ? "Select status" : "No update permission"
          }
          selectedKey={selectedStatus === "" ? undefined : selectedStatus}
          onSelectionChange={(key) =>
            setSelectedStatus(
              key == null || key === "" ? "" : (Number(key) as EOrderStatus),
            )
          }
          isDisabled={!canUpdateStatus || isUpdating || !hasNextStatus}
          options={statusOptions}
          size="md"
        />
        <Button
          onClick={updateStatus}
          disabled={
            !selectedStatus ||
            selectedStatus <= order.status ||
            !canUpdateStatus ||
            isUpdating
          }
          className="rounded-lg"
        >
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
};
