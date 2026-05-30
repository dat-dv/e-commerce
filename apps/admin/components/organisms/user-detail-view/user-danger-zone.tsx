import { Button } from "@ecommerce/ui";
import { Trash2 } from "lucide-react";

import type { IUserDangerZoneProps } from "./user-detail-view.types";

export const UserDangerZone = ({
  deleting,
  onDelete,
}: IUserDangerZoneProps) => (
  <section className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 shadow-xl backdrop-blur-xl">
    <div className="mb-5">
      <h2 className="text-lg font-bold text-red-300">Danger Zone</h2>
      <p className="mt-1 text-sm text-red-200/70">
        Removing a user soft-deletes the account and hides it from admin lists.
      </p>
    </div>

    <Button
      variant="ghost"
      onClick={onDelete}
      disabled={deleting}
      className="inline-flex w-full items-center justify-center gap-2 border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
    >
      <Trash2 className="h-4 w-4" />
      {deleting ? "Deleting..." : "Delete User"}
    </Button>
  </section>
);

UserDangerZone.displayName = "UserDangerZone";
