import type { IPermissionsStatusAlertProps } from "./permissions-view.types";

export const PermissionsStatusAlert = ({
  error,
  successMessage,
}: IPermissionsStatusAlertProps) => {
  if (!error && !successMessage) return null;

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm ${
        error
          ? "border-red-500/20 bg-red-500/10 text-red-300"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
      }`}
    >
      {error || successMessage}
    </div>
  );
};

PermissionsStatusAlert.displayName = "PermissionsStatusAlert";
