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
        <select
          value={editStatus}
          onChange={(e) => onStatusChange?.(Number(e.target.value))}
          className="focus:border-primary mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-2.5 py-1.5 text-sm text-[var(--app-text)] focus:outline-none"
        >
          <option value={0}>Draft</option>
          <option value={1}>Active</option>
          <option value={2}>Out of Stock</option>
        </select>
      ) : (
        <p className="text-sm font-semibold text-[var(--app-text)] capitalize">
          {status === 0 ? "Draft" : status === 1 ? "Active" : "Out of Stock"}
        </p>
      )}
    </div>
  );
};
