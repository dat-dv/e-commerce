import { Select } from "@ecommerce/ui";
import { Activity } from "lucide-react";

interface IProductStatusFieldProps {
  status: number;
  editStatus: number;
  isEditing: boolean;
  onStatusChange?: (status: number) => void;
}

export const ProductStatusField = ({
  status,
  editStatus,
  isEditing,
  onStatusChange,
}: IProductStatusFieldProps) => {
  return (
    <div className="border-content/5 bg-content/[0.02] rounded-lg border p-4">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wide text-[var(--muted)] uppercase">
        <Activity className="h-4 w-4" />
        Status
      </div>
      {isEditing ? (
        <Select
          aria-label="Product status"
          selectedKey={editStatus}
          onSelectionChange={(key) => onStatusChange?.(Number(key))}
          options={[
            { label: "Draft", value: 0 },
            { label: "Active", value: 1 },
            { label: "Out of Stock", value: 2 },
          ]}
          className="mt-1"
          size="sm"
        />
      ) : (
        <p className="text-sm font-semibold text-[var(--app-text)] capitalize">
          {status === 0 ? "Draft" : status === 1 ? "Active" : "Out of Stock"}
        </p>
      )}
    </div>
  );
};
